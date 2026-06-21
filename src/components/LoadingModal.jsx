import React from "react";

const LoadingModal = ({
  isOpen,
  title = "Please Wait",
  message = "Processing your request..."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-2xl text-center">
        
        <div className="flex justify-center mb-5">
          <div className="h-14 w-14 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>

        <h2 className="text-xl font-bold text-slate-800">
          {title}
        </h2>

        <p className="text-slate-500 mt-2">
          {message}
        </p>

        <div className="mt-5">
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 animate-pulse w-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingModal;