import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:8000");

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userId = userInfo?.userFound?._id;

  useEffect(() => {
    if (!userId) {
      console.error(
        "User ID not found. Please ensure userInfo contains '_id'."
      );
      return;
    }

    // Join the room
    socket.emit("joinRoom", "support-room");

    // Listen for messages from the server
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Cleanup listeners
    return () => {
      socket.off("receiveMessage");
    };
  }, [userId]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      room: "support-room",
      senderId: userId,
      message: newMessage,
    };

    // Emit the message to the server
    socket.emit("sendMessage", messageData);

    // Update local chat history
    setMessages((prev) => [...prev, messageData]);
    setNewMessage("");
  };

  if (!userId) {
    return (
      <div className="w-full max-w-lg mx-auto mt-8 text-center">
        <p className="text-red-500">
          Unable to load user information. Please log in again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      <div className="bg-gray-100 border rounded-lg p-4 h-80 overflow-y-scroll">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.senderId === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <input
          type="text"
          className="border rounded-l-lg p-2 flex-grow"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 rounded-r-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
