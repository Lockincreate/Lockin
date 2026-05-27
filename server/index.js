const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Store active users & calls
const activeUsers = new Map();
const activeCalls = new Map();

// ============ TOKEN GENERATION ENDPOINTS ============

// Auto-generate token
app.post('/api/token/generate', (req, res) => {
  try {
    const userId = uuidv4();
    const username = `User_${userId.substring(0, 8)}`;
    
    const token = jwt.sign(
      { userId, username, timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      userId,
      username,
      expiresIn: '24h'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Manual token generation (with custom username)
app.post('/api/token/manual', (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username || username.length < 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username must be at least 3 characters' 
      });
    }

    const userId = uuidv4();
    const token = jwt.sign(
      { userId, username, timestamp: Date.now() },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      userId,
      username,
      expiresIn: '24h'
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify token
app.post('/api/token/verify', (req, res) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ success: true, decoded });
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token' });
  }
});

// Get online users
app.get('/api/users/online', (req, res) => {
  const onlineUsers = Array.from(activeUsers.values());
  res.json({ success: true, users: onlineUsers });
});

// ============ SOCKET.IO REAL-TIME EVENTS ============

io.on('connection', (socket) => {
  console.log(`✅ User connected: ${socket.id}`);

  // User joins with token
  socket.on('user-join', (data) => {
    try {
      const decoded = jwt.verify(data.token, JWT_SECRET);
      
      activeUsers.set(socket.id, {
        socketId: socket.id,
        userId: decoded.userId,
        username: decoded.username,
        status: 'online',
        joinedAt: new Date()
      });

      socket.join('global-chat');
      io.emit('user-list-update', Array.from(activeUsers.values()));
      socket.emit('connection-success', { username: decoded.username });
      
      console.log(`👤 ${decoded.username} joined`);
    } catch (error) {
      socket.emit('auth-error', { error: 'Invalid token' });
    }
  });

  // Chat message
  socket.on('chat-message', (data) => {
    const user = activeUsers.get(socket.id);
    if (user) {
      io.emit('new-message', {
        from: user.username,
        fromId: user.userId,
        message: data.message,
        timestamp: new Date(),
        type: 'text'
      });
    }
  });

  // Initiate call
  socket.on('call-initiate', (data) => {
    const caller = activeUsers.get(socket.id);
    const recipient = Array.from(activeUsers.values()).find(
      u => u.userId === data.recipientId
    );

    if (caller && recipient) {
      const callId = uuidv4();
      activeCalls.set(callId, {
        callId,
        callerId: caller.userId,
        callerName: caller.username,
        callerSocketId: socket.id,
        recipientId: recipient.userId,
        recipientName: recipient.username,
        recipientSocketId: recipient.socketId,
        type: data.callType || 'voice', // voice or video
        startedAt: new Date(),
        status: 'ringing'
      });

      io.to(recipient.socketId).emit('incoming-call', {
        callId,
        from: caller.username,
        fromId: caller.userId,
        type: data.callType || 'voice'
      });

      console.log(`📞 Call initiated: ${caller.username} → ${recipient.username}`);
    }
  });

  // Accept call
  socket.on('call-accept', (data) => {
    const call = activeCalls.get(data.callId);
    if (call) {
      call.status = 'active';
      
      io.to(call.callerSocketId).emit('call-accepted', {
        callId: call.callId,
        recipientId: call.recipientId
      });

      console.log(`✅ Call accepted: ${call.callerName} ↔ ${call.recipientName}`);
    }
  });

  // Reject call
  socket.on('call-reject', (data) => {
    const call = activeCalls.get(data.callId);
    if (call) {
      io.to(call.callerSocketId).emit('call-rejected', {
        callId: call.callId,
        reason: data.reason || 'User declined'
      });

      activeCalls.delete(data.callId);
      console.log(`❌ Call rejected: ${call.callId}`);
    }
  });

  // End call
  socket.on('call-end', (data) => {
    const call = activeCalls.get(data.callId);
    if (call) {
      const otherUser = call.callerSocketId === socket.id 
        ? call.recipientSocketId 
        : call.callerSocketId;

      io.to(otherUser).emit('call-ended', { callId: data.callId });
      activeCalls.delete(data.callId);
      
      console.log(`🔚 Call ended: ${data.callId}`);
    }
  });

  // WebRTC Signaling
  socket.on('webrtc-offer', (data) => {
    io.to(data.to).emit('webrtc-offer', {
      from: socket.id,
      offer: data.offer
    });
  });

  socket.on('webrtc-answer', (data) => {
    io.to(data.to).emit('webrtc-answer', {
      from: socket.id,
      answer: data.answer
    });
  });

  socket.on('webrtc-ice-candidate', (data) => {
    io.to(data.to).emit('webrtc-ice-candidate', {
      from: socket.id,
      candidate: data.candidate
    });
  });

  // User disconnect
  socket.on('disconnect', () => {
    const user = activeUsers.get(socket.id);
    if (user) {
      activeUsers.delete(socket.id);
      io.emit('user-list-update', Array.from(activeUsers.values()));
      console.log(`❌ ${user.username} disconnected`);
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', users: activeUsers.size });
});

server.listen(PORT, () => {
  console.log(`
  ╔════════════════════════════════════╗
  ║   🔐 LOCKIN - Calling App Server   ║
  ║   Running on port ${PORT}            ║
  ║   WebSocket: ws://localhost:${PORT}  ║
  ╚════════════════════════════════════╝
  `);
});
