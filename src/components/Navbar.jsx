import React, { useState, useEffect } from 'react';
import { Bell, CircleUserRound, ArrowLeft, LogOut } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Create state to hold the actual user data
  const [user, setUser] = useState(null);

  // 2. Fetch the user from localStorage when the Navbar loads
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]); // Re-run if the route changes to ensure it's up to date

  // Helper function to add an active underline state to links
  const isActive = (path) => 
    location.pathname === path ? 'text-blue-600 font-semibold' : 'text-white hover:text-blue-600';

  // Helper function to handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className='fixed top-0 left-0 w-full z-50 h-16 bg-gray-900 backdrop-blur-md border-b border-slate-200 flex items-center shadow-sm'>
      <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between'>

        {/* LEFT SIDE: Brand Logo & Navigation links */}
        <div className='flex items-center gap-8 '>
          {/* Back Button */}
          <button onClick={() => navigate(-1)} className='text-white hover:text-slate-800 transition-colors'>
            <ArrowLeft />
          </button> 
          
          {/* Logo */}
          <Link to='/' className='text-2xl font-black tracking-tight text-blue-600 transition-transform active:scale-95'>
            Plot<span className='text-emerald-500'>Bridge</span>
          </Link>

          {/* Main Core Links (Conditionally Rendered) */}
          <div className='hidden md:flex items-center gap-6 text-xl font-medium text-white-600'>
            <Link to='/plots' className={`${isActive('/plots')} transition-colors`}>
              Plots
            </Link>

            {/* ONLY show Seller Dashboard if logged in user is a Seller */}
            {user?.userType === "Seller" && (
              <Link to='/seller-dashboard' className={`${isActive('/seller-dashboard')} transition-colors`}>
                Seller Dashboard
              </Link>
            )}

            {/* ONLY show Buyer Dashboard if logged in user is a Buyer */}
            {user?.userType === "Buyer" && (
              <Link to='/buyer-dashboard' className={`${isActive('/buyer-dashboard')} transition-colors`}>
                Buyer Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: System Utilities & Profile */}
        <div className='flex items-center gap-4'>
          
          {/* Notification Button */}
          <button className='p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-all relative group'>
            <Bell size={20} />
            <span className='absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white'></span>
          </button>

          <div className='flex items-center gap-3 border-l border-slate-200 pl-4'>
            
            {/* If User is NOT logged in, show Login/Signup */}
            {!user ? (
              <>
                <Link to='/login' className='text-sm font-semibold text-white hover:text-blue-600 transition-colors hidden sm:block'>
                  Login
                </Link>
                <Link to='/signup' className='text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow hover:scale-[1.02] active:scale-[0.98] hidden sm:block'>
                  Signup
                </Link>
              </>
            ) : (
              /* If User IS logged in, show Profile Picture and Logout */
              <div className="flex items-center gap-4">
                <Link 
                  to='/my-profile' 
                  className='flex items-center ring-2 ring-offset-2 ring-transparent hover:ring-blue-500 rounded-full transition-all overflow-hidden'
                >
                  {user.profilePhoto ? (
                    <img 
                          /* This grabs only the 'uploads/...' part of the string, ignoring the D:/ drive path */
                           src={user.profilePhoto} 
                            className='h-9 w-9 rounded-full object-cover border border-slate-200 shadow-sm' 
                      alt={user.fullName} 
                          />
                  ) : (
                    <CircleUserRound className='text-slate-500 hover:text-blue-600 transition-colors' size={28} />
                  )}
                </Link>

                <button 
                  onClick={handleLogout}
                  className="text-slate-500 hover:text-rose-500 transition-colors p-1"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar;