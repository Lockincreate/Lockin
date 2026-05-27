# Lockin - WhatsApp-like Calling & Messaging App

A lightweight, free calling and messaging application that works on any device without needing app store downloads.

## 🌟 Features

- **📞 Voice & Video Calling** - Crystal clear peer-to-peer calls
- **💬 Instant Messaging** - Real-time text chat
- **⚡ Lightning Fast** - Optimized for speed
- **🌐 Works Anywhere** - Web-based, no downloads needed
- **🔐 Secure Tokens** - Auto & manual token generation
- **📱 Mobile Friendly** - Responsive design
- **💯 100% Free** - Forever free, no ads

## 🚀 Quick Start

### Prerequisites
- Node.js v14+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Lockincreate/Lockin.git
cd Lockin
```

2. **Install dependencies**
```bash
npm install
cd client && npm install && cd ..
```

3. **Create .env file**
```bash
cp .env.example .env
```

4. **Start the server**
```bash
npm start
```

The server will run on `http://localhost:3001`

5. **In another terminal, start the client**
```bash
npm run client
```

The app will open at `http://localhost:3000`

## 📖 Usage

### Getting Started

1. **Auto Token** - Click "⚡ Quick Start" for instant access
2. **Manual Token** - Enter your name for a personalized experience

### Making Calls

1. Click on a user in the online list
2. Choose **🔊 Voice** or **📹 Video**
3. Wait for them to accept
4. Enjoy crystal-clear communication!

### Sending Messages

1. Type your message in the input box
2. Press Enter or click the send button
3. Messages appear instantly for all connected users

## 🏗️ Architecture

### Backend (Node.js + Express)

- **Token Generation** - Auto & manual JWT tokens
- **WebSocket (Socket.io)** - Real-time communication
- **WebRTC Signaling** - Call setup and management
- **User Management** - Online user tracking

### Frontend (React)

- **Token Generator** - Initial user setup
- **Chat Interface** - Messages and user list
- **Call Management** - Incoming/outgoing calls
- **Responsive Design** - Mobile and desktop support

## 📁 Project Structure

```
Lockin/
├── server/
│   └── index.js              # Express server & WebSocket
├── client/
│   ├── public/
│   │   └── index.html        # HTML entry point
│   └── src/
│       ├── index.js          # React entry point
│       ├── App.js            # Main app component
│       ├── App.css           # Global styles
│       └── components/
│           ├── TokenGenerator.js
│           ├── TokenGenerator.css
│           ├── ChatApp.js
│           └── ChatApp.css
├── package.json              # Backend dependencies
├── .env.example              # Environment variables template
└── README.md                 # This file
```

## 🔑 API Endpoints

### Token Management

```
POST /api/token/generate
  - Auto-generates a unique token and user ID
  
POST /api/token/manual
  - Generates token with custom username
  - Body: { "username": "string" }
  
POST /api/token/verify
  - Verifies if a token is valid
  - Body: { "token": "string" }
```

### User Management

```
GET /api/users/online
  - Returns list of currently online users
```

## 🔌 WebSocket Events

### Client → Server

- `user-join` - User connects with token
- `chat-message` - Send text message
- `call-initiate` - Start a call
- `call-accept` - Accept incoming call
- `call-reject` - Reject incoming call
- `call-end` - End active call
- `webrtc-offer` - WebRTC offer
- `webrtc-answer` - WebRTC answer
- `webrtc-ice-candidate` - ICE candidate

### Server → Client

- `connection-success` - Successful authentication
- `user-list-update` - Online users list
- `new-message` - Incoming message
- `incoming-call` - Incoming call notification
- `call-accepted` - Call accepted
- `call-rejected` - Call rejected
- `call-ended` - Call ended
- `webrtc-offer` - Incoming WebRTC offer
- `webrtc-answer` - Incoming WebRTC answer
- `webrtc-ice-candidate` - Incoming ICE candidate

## 🔧 Configuration

Edit `.env` to customize:

```env
PORT=3001                    # Server port
JWT_SECRET=your-secret-key   # JWT secret (change in production!)
NODE_ENV=development         # Environment
```

## 📱 Deploying to Your Phone

### Option 1: Web App (Easiest)
1. Deploy to **Heroku**, **Vercel**, or **Netlify**
2. Share the URL with your friend
3. Open on phone browser
4. Both of you get instant access!

### Option 2: Local Network
1. Run the server: `npm start`
2. Find your computer's IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Share URL: `http://YOUR_IP:3001` with your friend on same WiFi
4. Works instantly!

## 🐛 Troubleshooting

### "Connection refused"
- Make sure the server is running: `npm start`
- Check that port 3001 is not in use

### "WebSocket connection failed"
- Ensure the server URL is correct in the client
- Check CORS settings if running on different domains

### "Calls not connecting"
- Verify both users are online
- Check WebRTC is supported in your browser
- Ensure STUN/TURN servers are configured if behind NAT

## 🚀 Future Enhancements

- [ ] File sharing
- [ ] Group calling
- [ ] Message encryption
- [ ] Call recording
- [ ] Screen sharing
- [ ] Message history
- [ ] User profiles
- [ ] Presence indicators
- [ ] User blocking
- [ ] Notifications

## 📄 License

MIT - Feel free to use for personal and commercial projects

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 💬 Support

Have questions? Open an issue on GitHub or contact us.

---

**Made with ❤️ by Lockincreate**

*Lockin - Connect freely, communicate instantly*
