import React from "react";
import AddPlot from "./pages/AddPlot";
import Signup from "./pages/Signup";
import Home from "./pages/Home";

import { Routes, Route } from "react-router-dom";
import UserProfile from "./pages/MyProfile";
import Login from "./pages/Login";
import PlotsPage from "./pages/PlotPage";
import MyListings from "./components/dashboard/Mylistings";
import SellerDashHome from "./components/dashboard/SellerDashHome";
import SellerDashboardStats from "./components/dashboard/DashboardStats";
import BuyerDashHome from "./components/buyer/BuyerDashHome";
import BuyerProfile from "./components/buyer/MyProfile";
import SavedProperties from "./components/buyer/SavedProperties";
import PlotDetails from "./pages/plotdetails";
import Navbar from "./components/Navbar";
import EditProperty from "./components/dashboard/EditProperty";
import ChatPage from "./pages/ChatPage";
import Inbox from "./pages/Inbox"
import BuyerInbox from "./components/buyer/buyerinbox"

const App = () => {
  return (
    <div className="overflow-x-hidden">
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Seller Dashboard Routes */}
        <Route path="/seller-dashboard" element={<SellerDashHome />}>
          <Route index element={<SellerDashboardStats />} />
          <Route path="add-property" element={<AddPlot />} />
          <Route path="edit-property/:id" element={<EditProperty />} />
          
          <Route path="my-listings" element={<MyListings />} />
          <Route path="my-profile" element={<UserProfile />} />
           <Route path="inbox" element={<Inbox />} />
           <Route path="chat/:conversationId" element={<ChatPage />} />
        </Route>

      
        <Route path="/buyer-dashboard" element={<BuyerDashHome />}>
        <Route index element={<SavedProperties />} />
          <Route path="my-profile" element={<BuyerProfile />} />
           <Route path="inbox" element={<BuyerInbox />} />
           <Route path="chat/:conversationId" element={<ChatPage />} />
        </Route>

        {/* Public / Standalone Routes */}
        {/* Notice: The floating <AddPlot/> is gone! */}
        <Route path="/plots" element={<PlotsPage />} />
        <Route path="/plots/:id" element={<PlotDetails />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/my-profile" element={<UserProfile />} />
        <Route path="/login" element={<Login />} />
       
      </Routes>
    </div>
  );
};

export default App;