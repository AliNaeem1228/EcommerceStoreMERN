import http from "http";
import { Server } from "socket.io";
import morgan from "morgan";
import app from "./app/app.js";
import { verifyToken } from "./utils/verifyToken.js";

const PORT = process.env.PORT;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(morgan("combined"));

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error("Authentication error"));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return next(new Error("Authentication error"));
  }

  socket.userId = decoded.id;
  next();
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userId}`);

  socket.on("joinRoom", ({ receiverId }) => {
    const roomId = [socket.userId, receiverId].sort().join("-");
    socket.join(roomId);
    socket.roomId = roomId;

    console.log(`User ${socket.userId} joined room ${roomId}`);
  });

  socket.on("sendMessage", async ({ receiverId, message }) => {
    const chatMessage = new Chat({
      senderId: socket.userId,
      receiverId,
      message,
    });
    await chatMessage.save();

    const roomId = socket.roomId;
    io.to(roomId).emit("receiveMessage", {
      senderId: socket.userId,
      message,
      timestamp: chatMessage.timestamp,
    });

    console.log(
      `[Message Sent] Room: ${roomId}, From: ${socket.userId}, To: ${receiverId}, Message: "${message}"`
    );
    console.log(
      `[Message Received] Room: ${roomId}, From: ${socket.userId}, To: ${receiverId}, Message: "${message}"`
    );
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

server.listen(PORT, console.log(`Server is Running on Port: ${PORT}`));
