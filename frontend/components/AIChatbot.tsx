'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import api from '@/lib/axios';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Lightbulb, 
  TrendingUp, 
  FileText,
  Trash2,
  Minimize2,
  Maximize2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatMessage {
  _id: string;
  message: string;
  messageType: string;
  createdAt: string;
  isOwn: boolean;
}

interface Conversation {
  userMessage: ChatMessage;
  aiResponse: ChatMessage;
}

export default function AIChatbot() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'advice' | 'market' | 'contract'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Quick action forms
  const [adviceForm, setAdviceForm] = useState({
    cropType: '',
    location: '',
    season: 'current'
  });

  const [marketForm, setMarketForm] = useState({
    cropType: '',
    location: ''
  });

  const [contractForm, setContractForm] = useState({
    cropType: '',
    quantity: ''
  });

  useEffect(() => {
    if (isOpen && !isMinimized) {
      fetchChatHistory();
    }
  }, [isOpen, isMinimized]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChatHistory = async () => {
    setLoading(true);
    try {
      console.log('Fetching AI chat history...');
      const response = await api.get('/ai-chat/history');
      console.log('Chat history response:', response.data);
      const conversations: Conversation[] = response.data;
      
      // Flatten conversations into messages array
      const allMessages: ChatMessage[] = [];
      conversations.forEach(conv => {
        allMessages.push(conv.userMessage);
        allMessages.push(conv.aiResponse);
      });
      
      setMessages(allMessages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // Don't show error toast for history fetch failure
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    setSending(true);
    try {
      console.log('Sending message to AI:', newMessage);
      const response = await api.post('/ai-chat/message', {
        message: newMessage,
        context: {
          currentPage: window.location.pathname,
          userRole: user?.role
        }
      });

      console.log('AI response received:', response.data);
      setMessages(prev => [...prev, response.data.userMessage, response.data.aiResponse]);
      setNewMessage('');
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage = error.response?.data?.message || error.message || t.chatbot.failedToSend;
      toast.error(errorMessage);
    } finally {
      setSending(false);
    }
  };

  const getFarmingAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adviceForm.cropType || !adviceForm.location) return;

    setSending(true);
    try {
      const response = await api.post('/ai-chat/farming-advice', adviceForm);
      
      const userMessage: ChatMessage = {
        _id: Date.now().toString(),
        message: `Get farming advice for ${adviceForm.cropType} in ${adviceForm.location}`,
        messageType: 'text',
        createdAt: new Date().toISOString(),
        isOwn: true
      };

      const aiMessage: ChatMessage = {
        _id: (Date.now() + 1).toString(),
        message: response.data.advice,
        messageType: 'text',
        createdAt: new Date().toISOString(),
        isOwn: false
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      setAdviceForm({ cropType: '', location: '', season: 'current' });
      setActiveTab('chat');
    } catch (error: any) {
      console.error('Error getting farming advice:', error);
      toast.error(error.response?.data?.message || 'Failed to get farming advice');
    } finally {
      setSending(false);
    }
  };

  const getMarketInsights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketForm.cropType || !marketForm.location) return;

    setSending(true);
    try {
      const response = await api.post('/ai-chat/market-insights', marketForm);
      
      const userMessage: ChatMessage = {
        _id: Date.now().toString(),
        message: `Get market insights for ${marketForm.cropType} in ${marketForm.location}`,
        messageType: 'text',
        createdAt: new Date().toISOString(),
        isOwn: true
      };

      const aiMessage: ChatMessage = {
        _id: (Date.now() + 1).toString(),
        message: response.data.insights,
        messageType: 'text',
        createdAt: new Date().toISOString(),
        isOwn: false
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      setMarketForm({ cropType: '', location: '' });
      setActiveTab('chat');
    } catch (error: any) {
      console.error('Error getting market insights:', error);
      toast.error(error.response?.data?.message || 'Failed to get market insights');
    } finally {
      setSending(false);
    }
  };

  const getContractAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contractForm.cropType || !contractForm.quantity) return;

    setSending(true);
    try {
      const response = await api.post('/ai-chat/contract-advice', contractForm);
      
      const userMessage: ChatMessage = {
        _id: Date.now().toString(),
        message: `Get contract advice for ${contractForm.cropType} (${contractForm.quantity} units)`,
        messageType: 'text',
        createdAt: new Date().toISOString(),
        isOwn: true
      };

      const aiMessage: ChatMessage = {
        _id: (Date.now() + 1).toString(),
        message: response.data.advice,
        messageType: 'text',
        createdAt: new Date().toISOString(),
        isOwn: false
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      setContractForm({ cropType: '', quantity: '' });
      setActiveTab('chat');
    } catch (error: any) {
      console.error('Error getting contract advice:', error);
      toast.error(error.response?.data?.message || 'Failed to get contract advice');
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    if (!confirm(t.chatbot.clearChatConfirm)) return;

    try {
      await api.delete('/ai-chat/session');
      setMessages([]);
      toast.success(t.chatbot.chatCleared);
    } catch (error) {
      console.error('Error clearing chat:', error);
      toast.error(t.chatbot.failedToClear);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user) return null;

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-primary-600 to-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-50 animate-bounce"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed bottom-6 right-6 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 transition-all duration-300 ${
          isMinimized ? 'w-80 h-16' : 'w-96 h-[600px]'
        }`}>
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-primary-50 to-green-50 rounded-t-lg">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-600 to-green-600 p-2 rounded-full">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{t.chatbot.title}</h3>
                <p className="text-xs text-gray-600">{t.chatbot.subtitle}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Tabs */}
              <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${
                    activeTab === 'chat'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <MessageCircle className="h-4 w-4 inline mr-1" />
                  {t.chatbot.chat}
                </button>
                <button
                  onClick={() => setActiveTab('advice')}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${
                    activeTab === 'advice'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Lightbulb className="h-4 w-4 inline mr-1" />
                  {t.chatbot.advice}
                </button>
                <button
                  onClick={() => setActiveTab('market')}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${
                    activeTab === 'market'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <TrendingUp className="h-4 w-4 inline mr-1" />
                  {t.chatbot.market}
                </button>
                <button
                  onClick={() => setActiveTab('contract')}
                  className={`flex-1 px-3 py-2 text-sm font-medium ${
                    activeTab === 'contract'
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FileText className="h-4 w-4 inline mr-1" />
                  {t.chatbot.contract}
                </button>
              </div>

              {/* Chat Tab */}
              {activeTab === 'chat' && (
                <>
                  {/* Messages */}
                  <div className="flex-1 p-4 h-80 overflow-y-auto bg-gray-50">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Bot className="h-12 w-12 text-gray-400 mb-3" />
                        <p className="text-gray-500 text-sm mb-2">
                          {t.chatbot.welcome}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {t.chatbot.welcomeDesc}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div
                            key={message._id}
                            className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`flex items-start space-x-2 max-w-xs ${message.isOwn ? 'flex-row-reverse space-x-reverse' : ''}`}>
                              <div className={`p-2 rounded-full ${message.isOwn ? 'bg-primary-600' : 'bg-green-600'}`}>
                                {message.isOwn ? (
                                  <User className="h-3 w-3 text-white" />
                                ) : (
                                  <Bot className="h-3 w-3 text-white" />
                                )}
                              </div>
                              <div
                                className={`px-3 py-2 rounded-lg ${
                                  message.isOwn
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white text-gray-900 border border-gray-200'
                                }`}
                              >
                                <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    message.isOwn ? 'text-primary-100' : 'text-gray-500'
                                  }`}
                                >
                                  {formatTime(message.createdAt)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Input */}
                  <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t.chatbot.placeholder}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                        disabled={sending}
                      />
                      <button
                        type="button"
                        onClick={clearChat}
                        className="text-gray-400 hover:text-red-600 p-2"
                        title="Clear chat"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="h-4 w-4" />
                      </button>
                    </div>
                  </form>
                </>
              )}

              {/* Farming Advice Tab */}
              {activeTab === 'advice' && (
                <div className="p-4 h-96 overflow-y-auto">
                  <h3 className="font-semibold text-gray-900 mb-4">Get Farming Advice</h3>
                  <form onSubmit={getFarmingAdvice} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Crop Type
                      </label>
                      <input
                        type="text"
                        value={adviceForm.cropType}
                        onChange={(e) => setAdviceForm(prev => ({ ...prev, cropType: e.target.value }))}
                        placeholder="e.g., Rice, Wheat, Tomato"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={adviceForm.location}
                        onChange={(e) => setAdviceForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., Maharashtra, Punjab"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Season
                      </label>
                      <select
                        value={adviceForm.season}
                        onChange={(e) => setAdviceForm(prev => ({ ...prev, season: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                      >
                        <option value="current">Current Season</option>
                        <option value="kharif">Kharif (Monsoon)</option>
                        <option value="rabi">Rabi (Winter)</option>
                        <option value="zaid">Zaid (Summer)</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {sending ? 'Getting Advice...' : 'Get Farming Advice'}
                    </button>
                  </form>
                </div>
              )}

              {/* Market Insights Tab */}
              {activeTab === 'market' && (
                <div className="p-4 h-96 overflow-y-auto">
                  <h3 className="font-semibold text-gray-900 mb-4">Market Insights</h3>
                  <form onSubmit={getMarketInsights} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Crop Type
                      </label>
                      <input
                        type="text"
                        value={marketForm.cropType}
                        onChange={(e) => setMarketForm(prev => ({ ...prev, cropType: e.target.value }))}
                        placeholder="e.g., Rice, Wheat, Tomato"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        value={marketForm.location}
                        onChange={(e) => setMarketForm(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g., Maharashtra, Punjab"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {sending ? 'Getting Insights...' : 'Get Market Insights'}
                    </button>
                  </form>
                </div>
              )}

              {/* Contract Advice Tab */}
              {activeTab === 'contract' && (
                <div className="p-4 h-96 overflow-y-auto">
                  <h3 className="font-semibold text-gray-900 mb-4">Contract Farming Advice</h3>
                  <form onSubmit={getContractAdvice} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Crop Type
                      </label>
                      <input
                        type="text"
                        value={contractForm.cropType}
                        onChange={(e) => setContractForm(prev => ({ ...prev, cropType: e.target.value }))}
                        placeholder="e.g., Rice, Wheat, Tomato"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Quantity
                      </label>
                      <input
                        type="text"
                        value={contractForm.quantity}
                        onChange={(e) => setContractForm(prev => ({ ...prev, quantity: e.target.value }))}
                        placeholder="e.g., 100 kg, 10 quintal"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={sending}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                    >
                      {sending ? 'Getting Advice...' : 'Get Contract Advice'}
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}