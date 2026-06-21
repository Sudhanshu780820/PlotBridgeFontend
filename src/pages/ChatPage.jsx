import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { ArrowLeft, User, MapPin, ExternalLink } from "lucide-react";

const backendUrl = import.meta.env.VITE_API_BASE_URL;
const socket = io(backendUrl);

const ChatPage = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [chatMeta, setChatMeta] = useState(null); // Stores the plot and other user details
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const scrollRef = useRef();

  const localUser = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // Fetch both Messages and Conversation Details
  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch messages and meta-data at the exact same time for speed
        const [msgRes, metaRes] = await Promise.all([
          axios.get(`${backendUrl}/api/messages/${conversationId}`, { headers }),
          axios.get(`${backendUrl}/api/conversations/${conversationId}`, { headers })
        ]);

        if (Array.isArray(msgRes.data)) {
          setMessages(msgRes.data);
        } else if (msgRes.data && Array.isArray(msgRes.data.data)) {
          setMessages(msgRes.data.data);
        } else {
          setMessages([]);
        }

        setChatMeta(metaRes.data);
      } catch (error) {
        console.error("Error fetching chat data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
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

      const res = await axios.post(`${backendUrl}/api/messages`, messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.emit("send_message", res.data);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Figure out who the OTHER person is
  const otherUser = chatMeta?.participants?.find(
    (p) => String(p._id) !== String(localUser._id || localUser.id)
  );

  const plot = chatMeta?.plotId;

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      
      {/* PROFESSIONAL HEADER */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 shadow-sm z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        
        {/* Left: User Info */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 -ml-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border border-blue-200 overflow-hidden">
              {otherUser?.profilePhoto ? (
                <img src={otherUser.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <User size={20} />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-tight">
                {otherUser?.fullName || "PlotBridge User"}
              </h2>
              <p className="text-xs font-medium text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                {otherUser?.userType || "Member"}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Property Snippet */}
       {plot && (
  <Link
    to={`/plot/${plot._id}`}
    className="flex gap-3 bg-white border rounded-xl p-3 shadow-sm hover:shadow-md"
  >
    <img
      src={plot.images?.[0]}
      alt={plot.title}
      className="w-16 h-16 rounded-lg object-cover"
    />

    <div>
      <h3 className="font-bold">
        {plot.title}
      </h3>

      <p className="text-sm text-gray-500">
        {plot.location}
      </p>

      <p className="font-semibold text-green-600">
        ₹ {plot.price?.toLocaleString()}
      </p>
    </div>
  </Link>
)}
 </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {/* Security Warning snippet */}
        <div
  key={index}
  className={`flex ${
    isMine ? "justify-end" : "justify-start"
  }`}
>
  {!isMine && (
    <img
      src={
        msg.senderId?.profilePhoto ||
        otherUser?.profilePhoto ||
        "https://ui-avatars.com/api/?name=User"
      }
      alt="Profile"
      className="w-8 h-8 rounded-full object-cover mr-2 self-end"
    />
  )}

  <div className="max-w-[85%] sm:max-w-[70%]">
    <div
      className={`px-4 py-2.5 shadow-sm break-words ${
        isMine
          ? "bg-blue-600 text-white rounded-2xl rounded-br-sm"
          : "bg-white border border-slate-200 text-slate-800 rounded-2xl rounded-bl-sm"
      }`}
    >
      {msg.text}
    </div>

    <div
      className={`text-[10px] text-slate-400 mt-1 px-1 ${
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
        <div ref={scrollRef}></div>
      </div>

      {/* INPUT AREA */}
      <div className="bg-white border-t border-slate-200 p-3 sm:p-4 z-10">
        <form onSubmit={handleSendMessage} className="max-w-5xl mx-auto flex gap-2 sm:gap-3 items-end">
          <textarea
            rows="1"
            placeholder="Type your message here..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              // Submit on Enter (without shift)
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none max-h-32 custom-scrollbar transition-all"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-blue-600 text-white h-[46px] px-6 rounded-xl font-bold shadow-sm shadow-blue-200 hover:bg-blue-700 hover:shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center shrink-0"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
  }


export default ChatPage;