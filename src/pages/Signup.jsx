import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {  useNavigate } from "react-router-dom";
import LoadingModal from "../components/LoadingModal";

const Signup = () => {
  // 1. Initialize state for all form fields
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    userType: "",
    profilePhoto: null,
    identityCard: null, 
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  // 2. Handle text, select, and checkbox inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // 3. Handle file uploads (Profile Photo & Identity Verification)
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: files[0], // Captures the raw file object
    }));
  };

  // 4. Handle Form Submission to Database
const handleSubmit = async (e) => {
  e.preventDefault();

  // Frontend Validation
  if (formData.password !== formData.confirmPassword) {
    alert("Passwords do not match!");
    return;
  }

  if (!formData.agreeTerms) {
    alert("You must agree to the Terms & Conditions");
    return;
  }

  try {
    // Show loading popup
    setLoading(true);

    const dataToSend = new FormData();

    dataToSend.append("fullName", formData.fullName);
    dataToSend.append("email", formData.email);
    dataToSend.append("phone", formData.phone);
    dataToSend.append("userType", formData.userType);
    dataToSend.append("password", formData.password);

    if (formData.profilePhoto) {
      dataToSend.append("profilePhoto", formData.profilePhoto);
    }

    if (formData.identityCard) {
      dataToSend.append("identityCard", formData.identityCard);
    }

    console.log("--- Data Being Sent ---");

    for (let [key, value] of dataToSend.entries()) {
      console.log(`${key}:`, value);
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`,
      {
        method: "POST",
        body: dataToSend,
      }
    );

    const result = await response.json();

    if (response.ok) {
      alert("Account created successfully!");

      // Optional small delay so user sees success
      setTimeout(() => {
        navigate("/login");
      }, 500);

    } else {
      alert(`Failed: ${result.message}`);
      console.error("Backend Error:", result);
    }

  } catch (error) {
    console.error("Network or server error:", error);

    alert(
      "Could not connect to the server. Please try again."
    );
  } finally {
    // Hide loading popup
    setLoading(false);
  }
};

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10 px-4">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>

          <p className="text-center text-gray-500 mb-8">
            Join PlotBridge and start buying or selling land.
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label className="block font-medium mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your name"
                className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block font-medium mb-1">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block font-medium mb-1">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* User Type */}
            <div>
              <label className="block font-medium mb-1">User Type</label>
              <select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                className="w-full border rounded-lg p-3"
                required
              >
                <option value="">Select User Type</option>
                <option value="Buyer">Buyer</option>
                <option value="Seller">Seller</option>
              </select>
            </div>

            {/* Profile Photo */}
            <div>
              <label className="block font-medium mb-1">Profile Photo</label>
              <input
                type="file"
                name="profilePhoto"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full border rounded-lg p-2"
              />
            </div>

            {/* Verification Document */}
            <div>
              <label className="block font-medium mb-1">Identity Document</label>
              <input
                type="file"
                name="identityCard"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full border rounded-lg p-2"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Upload identity verification document
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block font-medium mb-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full border rounded-lg p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            {/* Terms */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <span className="text-sm">I agree to the Terms & Conditions</span>
            </div>

            {/* Submit */}
           <button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
>
  {loading ? "Creating Account..." : "Create Account"}
</button>
          </form>

          <p className="text-center text-sm mt-6">
            Already have an account?
            <span className="text-blue-600 cursor-pointer ml-1">Login</span>
          </p>
        </div>
      </div>
        <LoadingModal
    isOpen={loading}
    title="Creating Account"
    message="Please wait while we create your PlotBridge account..."
  />
    </>
  );
};

export default Signup;