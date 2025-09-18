'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/lib/axios';
import { Send, X, Paperclip, Image } from 'lucide-react';
import toast from 'react-hot-toast';

interface Message {
  _id: string;
  senderId: {
    _id: string;
    username: string;
    role: string;
  };
  receiverId: {
    _id: string;
    username: string;
    role: string;
  };
  message: string;
  messageType: string;
  fileUrl?: string;
  createdAt: string;
  isRead: boolean;
}

interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  participantId: string;
  participantName: string;
  contractId?: string;
}

export default function ChatWindow({
  isOpen,
  onClose,
  participantId,
  participantName,
  contractId
}: ChatWindowProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && participantId) {
      fetchMessages();
      // Mark messages as read
      markMessagesAsRead();
    }
  }, [isOpen, participantId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    setLoading(true);
    try {
      // Create or get chat room first
      await api.post('/chat/room', {
        participantId,
        contractId
      });

      // Then fetch messages
      const response = await api.get(`/chat/room/messages`, {
        params: { participantId, contractId }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await api.put('/chat/messages/read', {
        senderId: participantId
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      const response = await api.post('/chat/message', {
        receiverId: participantId,
        contractId,
        message: newMessage,
        messageType: 'text'
      });

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('receiverId', participantId);
    formData.append('contractId', contractId || '');
    formData.append('message', `Sent ${file.type.startsWith('image/') ? 'an image' : 'a file'}`);
    formData.append('messageType', file.type.startsWith('image/') ? 'image' : 'file');

    setSending(true);
    try {
      const response = await api.post('/chat/message', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setMessages(prev => [...prev, response.data]);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Failed to send file');
    } finally {
      setSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-primary-50 rounded-t-lg">
        <div>
          <h3 className="font-medium text-gray-900">{participantName}</h3>
          <p className="text-sm text-gray-600">Online</p>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 h-64 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message) => {
              const isOwn = message.senderId._id === user?.id;
              return (
                <div
                  key={message._id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg ${isOwn
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                      }`}
                  >
                    {message.messageType === 'image' && message.fileUrl && (
                      <img
                        src={`http://localhost:5000${message.fileUrl}`}
                        alt="Shared image"
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    )}
                    <p className="text-sm">{message.message}</p>
                    <p
                      className={`text-xs mt-1 ${isOwn ? 'text-primary-100' : 'text-gray-500'
                        }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,.pdf,.doc,.docx"
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-gray-400 hover:text-gray-600"
          >
            <Paperclip className="h-5 w-5" />
          </button>

          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            disabled={sending}
          />

          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}