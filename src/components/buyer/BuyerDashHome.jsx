import BuyerSidebar from "./BuyerSidebar";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../Navbar";
const BuyerDashHome = () => {
  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-100 mt-12">
        <BuyerSidebar />

        <div className="flex-1 ml-64 p-6">
          <h1 className="text-3xl font-bold mb-6">Buyer Dashboard</h1>

         <Outlet />
          
        </div>
      </div>
    </>
  );
};

export default BuyerDashHome;
