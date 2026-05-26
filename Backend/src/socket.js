import { Server } from "socket.io";
import http from "http";
import express from "express";
import jwt from "jsonwebtoken";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

const userSocketMap = {}; // {userId: socketId}
const socketEventCounts = new Map(); // {socketId: eventCount}

// Reset rate limiting counters every minute
setInterval(() => {
  socketEventCounts.clear();
}, 60 * 1000);

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

// 1. JWT Authentication Middleware for Socket.io Connections
io.use((socket, next) => {
  // Extract token from auth handshake or fall back to query
  const token = socket.handshake.auth?.token || socket.handshake.query?.token;

  if (!token) {
    console.warn("⚠️ Socket connection rejected: Missing auth token.");
    return next(new Error("Authentication error: Token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    socket.user = decoded;
    next();
  } catch (err) {
    console.warn("⚠️ Socket connection rejected: Invalid auth token.");
    return next(new Error("Authentication error: Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("✅ A user connected with socket id:", socket.id);
  
  // Use verified ID from JWT to prevent userId spoofing
  const userId = socket.user?._id;
  const userName = socket.handshake.query.userName || "there";

  if (userId) {
    userSocketMap[userId] = socket.id;

    // Emit welcome notification
    socket.emit("notification", {
      message: `Welcome back, ${userName}! 👋`,
      type: "welcome",
    });
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // 2. Rate Limiting Middleware for incoming client emissions
  socket.use((packet, next) => {
    const limit = 60; // Max 60 emissions per minute
    const count = socketEventCounts.get(socket.id) || 0;

    if (count >= limit) {
      console.warn(`⚠️ Socket rate limit exceeded for ${socket.id}`);
      return next(new Error("Rate limit exceeded. Too many events."));
    }

    socketEventCounts.set(socket.id, count + 1);
    next();
  });

  // --- WebRTC Tele-Consultation Signaling System ---
  socket.on("webrtc:join-room", ({ roomId, userId }) => {
    socket.join(roomId);
    console.log(`📹 User ${userId} (${socket.id}) joined video room: ${roomId}`);
    // Notify other users in the room
    socket.to(roomId).emit("webrtc:user-joined", { userId, socketId: socket.id });
  });

  socket.on("webrtc:offer", ({ roomId, offer }) => {
    console.log(`📤 Sending WebRTC offer to room: ${roomId}`);
    socket.to(roomId).emit("webrtc:offer", { offer, senderId: socket.id });
  });

  socket.on("webrtc:answer", ({ roomId, answer }) => {
    console.log(`📥 Sending WebRTC answer to room: ${roomId}`);
    socket.to(roomId).emit("webrtc:answer", { answer, senderId: socket.id });
  });

  socket.on("webrtc:ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("webrtc:ice-candidate", { candidate, senderId: socket.id });
  });

  socket.on("webrtc:leave", ({ roomId, userId }) => {
    socket.leave(roomId);
    console.log(`🛑 User ${userId} left video room: ${roomId}`);
    socket.to(roomId).emit("webrtc:user-left", { userId, socketId: socket.id });
  });

  socket.on("disconnect", () => {
    console.log("❌ A user disconnected", socket.id);
    if (userId) {
      delete userSocketMap[userId];
    }
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
