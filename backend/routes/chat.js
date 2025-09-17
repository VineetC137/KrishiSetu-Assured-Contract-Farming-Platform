const express = require('express');
const { Message, ChatRoom } = require('../models/Chat');
const { auth } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Get or create chat room
router.post('/room', auth, async (req, res) => {
  try {
    const { participantId, contractId } = req.body;
    
    let chatRoom = await ChatRoom.findOne({
      participants: { $all: [req.user._id, participantId] },
      contractId: contractId
    }).populate('participants', 'username role')
      .populate('lastMessage');

    if (!chatRoom) {
      chatRoom = new ChatRoom({
        participants: [req.user._id, participantId],
        contractId: contractId
      });
      await chatRoom.save();
      await chatRoom.populate('participants', 'username role');
    }

    res.json(chatRoom);
  } catch (error) {
    console.error('Create chat room error:', error);
    res.status(500).json({ message: 'Server error creating chat room' });
  }
});

// Get user's chat rooms
router.get('/rooms', auth, async (req, res) => {
  try {
    const chatRooms = await ChatRoom.find({
      participants: req.user._id
    })
      .populate('participants', 'username role profileImage')
      .populate('lastMessage')
      .populate('contractId', 'cropType status')
      .sort({ lastActivity: -1 });

    res.json(chatRooms);
  } catch (error) {
    console.error('Get chat rooms error:', error);
    res.status(500).json({ message: 'Server error fetching chat rooms' });
  }
});

// Get messages for a chat room
router.get('/room/:roomId/messages', auth, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    
    const messages = await Message.find({
      $or: [
        { senderId: req.user._id, receiverId: { $exists: true } },
        { receiverId: req.user._id, senderId: { $exists: true } }
      ]
    })
      .populate('senderId', 'username role')
      .populate('receiverId', 'username role')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json(messages.reverse());
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error fetching messages' });
  }
});

// Send message
router.post('/message', auth, upload.single('file'), async (req, res) => {
  try {
    const { receiverId, contractId, message, messageType = 'text' } = req.body;

    const newMessage = new Message({
      senderId: req.user._id,
      receiverId,
      contractId,
      message,
      messageType,
      fileUrl: req.file ? `/uploads/${req.file.filename}` : null
    });

    await newMessage.save();
    await newMessage.populate('senderId', 'username role');
    await newMessage.populate('receiverId', 'username role');

    // Update chat room last activity
    await ChatRoom.findOneAndUpdate(
      {
        participants: { $all: [req.user._id, receiverId] },
        contractId: contractId
      },
      {
        lastMessage: newMessage._id,
        lastActivity: new Date()
      }
    );

    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error sending message' });
  }
});

// Mark messages as read
router.put('/messages/read', auth, async (req, res) => {
  try {
    const { senderId } = req.body;

    await Message.updateMany(
      {
        senderId: senderId,
        receiverId: req.user._id,
        isRead: false
      },
      {
        isRead: true,
        readAt: new Date()
      }
    );

    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Server error marking messages as read' });
  }
});

module.exports = router;