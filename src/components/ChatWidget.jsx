import { useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm PlotBridge AI.\nHow can I help you today?",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message,
    };

    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/ai/chat`, {
        message,
      });

     setMessages((prev) => [
  ...prev,
  {
    sender: "bot",
    text: res.data.reply,
    properties: res.data.properties || [],
  },
]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong.",
        },
      ]);
    }

    setMessage("");
    setLoading(false);
  };

  return (
    <>
      {/* Floating Button */}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full bg-blue-600 text-white text-3xl shadow-lg hover:bg-blue-700 z-50"
      >
        💬
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-50">

          {/* Header */}

          <div className="bg-blue-600 text-white p-4 font-semibold text-lg">
            PlotBridge AI
          </div>

          {/* Messages */}

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-100">

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
  className={`max-w-[80%] rounded-xl px-4 py-2 whitespace-pre-wrap ${
    msg.sender === "user"
      ? "bg-blue-600 text-white"
      : "bg-white shadow"
  }`}
>
  <p>{msg.text}</p>

  {msg.properties?.length > 0 && (
    <div className="mt-3 space-y-3">
      {msg.properties.map((property) => (
        <div
          key={property._id}
          className="border rounded-lg overflow-hidden bg-white shadow"
        >
          <img
            src={property.images?.[0]}
            alt={property.title}
            className="w-full h-36 object-cover"
          />

          <div className="p-3">
            <h3 className="font-semibold text-gray-800">
              {property.title}
            </h3>

            <p className="text-sm text-gray-600">
              📍 {property.location}
            </p>

            <p className="text-green-600 font-bold">
              ₹ {property.price?.toLocaleString()}
            </p>

            <p className="text-sm">
              📐 {property.size} sq.ft
            </p>

            <button
              onClick={() =>
                window.open(`/plots/${property._id}`, "_blank")
              }
              className="mt-2 bg-blue-600 text-white px-3 py-1 rounded text-sm"
            >
              View Property
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
              </div>
            ))}

            {loading && (
              <div className="text-gray-500">
                AI is typing...
              </div>
            )}
          </div>

          {/* Input */}

          <div className="p-4 border-t flex gap-2">

            <input
              className="flex-1 border rounded-lg px-4 py-2 outline-none"
              placeholder="Ask anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") sendMessage();
              }}
            />

            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-5 rounded-lg"
            >
              Send
            </button>

          </div>

        </div>
      )}
    </>
  );
}