import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [receiverId, setReceiverId] = useState("adminUserId"); // Replace with actual admin ID

  useEffect(() => {
    // Initialize Socket.IO connection
    const newSocket = io("http://localhost:8000", {
      auth: {
        token: localStorage.getItem("token"), // Ensure the user is logged in and token is available
      },
    });

    // Listen for events
    newSocket.on("connect", () => {
      console.log("Connected to server");
      newSocket.emit("joinRoom", { receiverId }); // Join a room with admin
    });

    newSocket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]); // Add incoming messages to the list
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [receiverId]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const message = { receiverId, message: inputMessage };

      // Emit message to the server
      socket.emit("sendMessage", message);

      // Optimistically add the message to the UI
      setMessages((prev) => [
        ...prev,
        { senderId: "me", message: inputMessage, timestamp: new Date() },
      ]);

      setInputMessage("");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "20px" }}>
      <h3>Support Chat</h3>
      <div
        style={{
          border: "1px solid #ccc",
          padding: "10px",
          borderRadius: "8px",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.senderId === "me" ? "right" : "left",
              margin: "5px 0",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px",
                borderRadius: "8px",
                background: msg.senderId === "me" ? "#007bff" : "#f1f1f1",
                color: msg.senderId === "me" ? "white" : "black",
              }}
            >
              {msg.message}
            </div>
            <div style={{ fontSize: "10px", color: "#888" }}>
              {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type your message..."
        style={{
          width: "80%",
          padding: "8px",
          borderRadius: "4px",
          border: "1px solid #ccc",
        }}
      />
      <button
        onClick={sendMessage}
        style={{
          width: "18%",
          marginLeft: "2%",
          padding: "8px",
          borderRadius: "4px",
          background: "#007bff",
          color: "white",
          border: "none",
        }}
      >
        Send
      </button>
    </div>
  );
};

export default Chat;
