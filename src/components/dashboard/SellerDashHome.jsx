import { Outlet } from "react-router-dom";
import Sidebar from "../Seller_Dashboard_sidebar";
import Navbar from "../Navbar";

const SellerDashHome = () => {
  return (
    <>
      <Navbar/>
    <div className="flex bg-gray-100 min-h-screen mt-12">
   
      
      <Sidebar />

      <div className="flex-1 ml-64 p-6">
        <Outlet/>
         
      </div>
    </div>
      
    
    </>
   
  );
};

export default SellerDashHome;