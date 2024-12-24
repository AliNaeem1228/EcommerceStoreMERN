import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const ChatComponent = () => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [nickname, setNickname] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:3000/chat", {
      auth: { token: "123456" }, // Replace with a dynamic token if needed
    });

    newSocket.on("chat message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    newSocket.on("online", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("typing", (data) => {
      console.log(data); // Optional: Display typing notification
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  const handleLogin = () => {
    if (nickname && roomNumber) {
      socket.emit("login", { nickname, roomNumber });
      setIsLoggedIn(true);
    }
  };

  const sendMessage = () => {
    if (message) {
      const chatMessage = {
        name: nickname,
        roomNumber,
        text: message,
      };
      socket.emit("chat message", chatMessage);
      setMessage("");
    }
  };

  const handleTyping = () => {
    socket.emit("typing", { name: nickname, roomNumber });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {!isLoggedIn ? (
        <div>
          <h2>Join Chat</h2>
          <input
            type="text"
            placeholder="Enter your nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <br />
          <input
            type="text"
            placeholder="Enter room number"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
          />
          <br />
          <button onClick={handleLogin}>Join</button>
        </div>
      ) : (
        <div>
          <h2>Chat Room: {roomNumber}</h2>
          <p>Online Users: {onlineUsers.map((user) => user.name).join(", ")}</p>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              height: "300px",
              overflowY: "scroll",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>
                <strong>{msg.name}:</strong> {msg.text} <em>{msg.date}</em>
              </div>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleTyping}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
