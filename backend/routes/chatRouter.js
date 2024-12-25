import express from "express";
import Chat from "../model/Chat.js";

const chatRouter = express.Router();

// Fetch chat history between a user and admin
chatRouter.get("/:userId", async (req, res) => {
  try {
    const chats = await Chat.find().sort({ createdAt: 1 });
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch chat history" });
  }
});

// Save a new chat message
chatRouter.post("/", async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    // Validate ObjectId format
    if (
      !mongoose.Types.ObjectId.isValid(req.userAuthId) ||
      !mongoose.Types.ObjectId.isValid(receiverId)
    ) {
      return res.status(400).json({ error: "Invalid senderId or receiverId" });
    }

    // Save message to MongoDB
    const chatMessage = await Chat.create({
      senderId: mongoose.Types.ObjectId(req.userAuthId),
      receiverId: mongoose.Types.ObjectId(receiverId),
      message,
    });

    res.status(201).json(chatMessage);
  } catch (error) {
    console.error("Error saving or sending message:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
});

export default chatRouter;
