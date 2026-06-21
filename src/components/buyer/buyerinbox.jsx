import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  MessageSquare,
  Search,
  Clock,
  User,
  ChevronRight,
} from "lucide-react";

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [filteredChats, setFilteredChats] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/conversations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setConversations(res.data);
        setFilteredChats(res.data);
      } catch (error) {
        console.error("Error fetching inbox:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInbox();
  }, []);

  useEffect(() => {
    const filtered = conversations.filter((chat) => {
      const otherPerson = chat.participants?.find(
        (p) => p._id !== currentUser?._id
      );

      return (
        otherPerson?.fullName
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        chat.plotId?.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    });

    setFilteredChats(filtered);
  }, [search, conversations]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">
            My Messages
          </h1>

          <p className="text-slate-500 mt-1">
            Manage all your property conversations
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search chats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Stats Card */}

      <div className="bg-white rounded-2xl border border-slate-200 p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-3">
          <MessageSquare className="text-blue-600" />

          <div>
            <p className="text-sm text-slate-500">
              Total Conversations
            </p>

            <h2 className="text-2xl font-bold text-slate-800">
              {conversations.length}
            </h2>
          </div>
        </div>
      </div>

      {/* Empty State */}

      {filteredChats.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
          <MessageSquare
            size={50}
            className="mx-auto text-slate-300 mb-4"
          />

          <h3 className="text-xl font-semibold text-slate-700">
            No conversations found
          </h3>

          <p className="text-slate-500 mt-2">
            Start chatting with sellers from property pages.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {filteredChats.map((chat) => {
            const otherPerson = chat.participants?.find(
              (p) => p._id !== currentUser?._id
            );

            return (
              <Link
                key={chat._id}
                to={`/buyer-dashboard/chat/${chat._id}`}
                className="flex items-center justify-between p-5 border-b last:border-b-0 hover:bg-slate-50 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    {otherPerson?.profilePhoto ? (
                      <img
                        src={otherPerson.profilePhoto}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User
                        size={24}
                        className="text-blue-600"
                      />
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {otherPerson?.fullName || "Unknown User"}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      Property:{" "}
                      <span className="font-medium">
                        {chat.plotId?.title || "Property"}
                      </span>
                    </p>

                    <div className="flex items-center gap-1 text-xs text-slate-400 mt-1">
                      <Clock size={12} />
                      {new Date(
                        chat.updatedAt
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  size={20}
                  className="text-slate-400 group-hover:text-blue-600"
                />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Inbox;