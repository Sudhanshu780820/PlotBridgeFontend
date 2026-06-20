
import {
  LayoutDashboard,
  Search,
  Heart,
  MessageSquare,
  History,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import {Link} from 'react-router-dom'

const BuyerSidebar = () => {
  return (
    <div className="fixed  w-64 h-screen bg-gray-900 text-white p-5">
      <h1 className="text-2xl font-bold mb-8">
        Plot<span className="text-blue-500">Bridge</span>
      </h1>

      <nav className="space-y-2">
        
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <Search size={20} />
          <span>Browse Properties</span>
        </div>
         
         <Link to='/buyer-dashboard'>
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <Heart size={20} />
          <span>Saved Properties</span>
        </div>
        </Link>

        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <MessageSquare size={20} />
          <span>My Inquiries</span>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <History size={20} />
          <span>Recently Viewed</span>
        </div>
         
         <Link to='/buyer-dashboard/my-profile'>
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <User size={20} />
          <span>Profile </span>
        </div>
        </Link>

        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </nav>

      <div className="mt-20">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 cursor-pointer">
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default BuyerSidebar;