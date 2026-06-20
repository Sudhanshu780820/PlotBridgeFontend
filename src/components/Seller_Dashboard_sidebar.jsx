import {
  LayoutDashboard,
  Building2,
  PlusCircle,
  MessageSquare,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import {Link,Outlet} from 'react-router-dom'

const Sidebar = () => {
  return (
     <div className="fixed  w-64 h-screen bg-gray-900 text-white p-5">
      
      <h1 className="text-2xl font-bold mb-8">
        Plot<span className="text-blue-500">Bridge</span>
      </h1>

      <nav className="space-y-2">
        <Link to='/seller-dashboard'>
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <LayoutDashboard size={20} />
          <button>Home </button>
        </div>
        </Link>

           <Link to='/seller-dashboard/my-listings' >
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <Building2 size={20} />
         <button> My Properties</button>
        </div>
        </Link>


        <Link to='/seller-dashboard/add-property' >
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <PlusCircle size={20} />
          <button>Add Property </button>
        </div>
        </Link>
        <Link to='/inbox'>
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-800 cursor-pointer">
          <MessageSquare size={20} />
          <span>Inquiries</span>
        </div>
        </Link>
        {/* Inbox Button */}

         
         <Link to='/seller-dashboard/my-profile'>
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

      <div className="absolute bottom-5">
        <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-red-600 cursor-pointer">
          <LogOut size={20} />
          <span>Logout</span>
        </div>
      </div>
        
    </div>

    
  );
};

export default Sidebar;