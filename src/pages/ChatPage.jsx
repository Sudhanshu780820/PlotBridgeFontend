import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_API_BASE_URL;
const socket = io(backendUrl);

const ChatPage = () => {
  const { conversationId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const scrollRef = useRef();

  const localUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${backendUrl}/api/messages/${conversationId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessages(res.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [conversationId, token]);

  // Socket Connection
  useEffect(() => {
    socket.emit("join_room", conversationId);

    socket.on("receive_message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [conversationId]);

  // Auto Scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // Send Message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    try {
      const messageData = {
        conversationId,
        senderId: localUser._id || localUser.id,
        text: newMessage,
      };

      const res = await axios.post(
        `${backendUrl}/api/messages`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      socket.emit("send_message", res.data);

      setMessages((prev) => [...prev, res.data]);

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b px-5 py-4 shadow-sm">
        <h2 className="text-xl font-semibold text-gray-800">
          Conversation
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const isMine =
              String(msg.senderId) ===
              String(localUser?._id || localUser?.id);

            return (
              <div
                key={index}
                className={`flex ${
                  isMine ? "justify-end" : "justify-start"
                }`}
              >
                <div className="max-w-[75%]">
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm break-words ${
                      isMine
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div
                    className={`text-xs text-gray-500 mt-1 ${
                      isMine ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.createdAt
                      ? new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No messages yet. Start the conversation!
          </div>
        )}

        <div ref={scrollRef}></div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="bg-white border-t p-4 flex gap-2"
      >
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatPage;