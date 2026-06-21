import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const Inbox = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get the current user from localStorage so we know who we are
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchInbox = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/conversations`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setConversations(res.data);
      } catch (error) {
        console.error("Error fetching inbox:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchInbox();
    }
  }, []);

  if (loading) return <div className="text-center mt-20">Loading your messages...</div>;

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-24 min-h-screen">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">My Messages</h1>

        {conversations.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-slate-200">
            <p className="text-slate-500">You don't have any messages yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {conversations.map((chat) => {
              // Figure out who the *other* person is in this chat
              const otherPerson = chat.participants.find(p => p._id !== currentUser._id);

              return (
                <Link 
                  key={chat._id} 
                  to={`/seller-dashboard/chat/${chat._id}`}
                  className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-4">
                    {/* Profile Photo Placeholder */}
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-xl">
                      {otherPerson?.fullName?.charAt(0) || '?'}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {otherPerson?.fullName || 'Unknown User'}
                      </h3>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Discussing: <span className="font-medium">{chat.plotId?.title || 'A Property'}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-sm text-slate-400">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Inbox;