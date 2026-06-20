import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_API_BASE_URL;
const socket = io(backendUrl); 

const ChatPage = ({ currentUser }) => {
  const { conversationId } = useParams(); // Get the ID from the URL
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const scrollRef = useRef();

  // 1. Fetch old messages when the page loads
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${conversationId}`);
        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    fetchMessages();
  }, [conversationId]);

  // 2. Setup Real-time Socket.io connection
  useEffect(() => {
    // Join the specific chat room
    socket.emit("join_room", conversationId);

    // Listen for incoming messages from the other person
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    // Cleanup when leaving the page
    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

  // 3. Auto-scroll to the newest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 4. Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const messageData = {
      conversationId: conversationId,
      senderId: currentUser._id,
      text: newMessage,
    };

    try {
      // Save message to MongoDB
      const res = await axios.post('/api/messages', messageData);
      
      // Send message to the other person via Socket.io
      socket.emit("send_message", res.data);

      // Add it to our own screen instantly
      setMessages([...messages, res.data]);
      setNewMessage(""); // Clear the input box
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4">
      <div className="bg-gray-800 text-white p-4 rounded-t-lg">
        <h2 className="text-xl font-bold">Chat</h2>
      </div>

      {/* Message Display Area */}
      <div className="flex-1 overflow-y-auto bg-gray-100 p-4 border-l border-r">
        {messages.map((m, index) => (
          <div 
            key={index} 
            ref={scrollRef}
            className={`flex flex-col mb-4 ${m.senderId === currentUser._id ? 'items-end' : 'items-start'}`}
          >
            <div className={`px-4 py-2 rounded-lg max-w-[70%] ${
              m.senderId === currentUser._id 
                ? 'bg-blue-600 text-white rounded-br-none' 
                : 'bg-white text-gray-800 rounded-bl-none shadow'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Area */}
      <form onSubmit={handleSendMessage} className="bg-white p-4 flex border rounded-b-lg shadow">
        <input
          type="text"
          className="flex-1 border-gray-300 border rounded-l-lg p-2 outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button 
          type="submit" 
          className="bg-blue-600 text-white px-6 rounded-r-lg font-semibold hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;