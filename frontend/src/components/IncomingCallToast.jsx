import React from "react";

const IncomingCallToast = ({ from, type, onAccept, onReject }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex items-center justify-between w-80">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          📞 Incoming <br/> Still Working
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          From: Work is Pending
        </p>
      </div>
      <div className="flex gap-2">
        <button
          onClick={onAccept}
          className="bg-green-500 text-white px-3 py-1 rounded-full hover:bg-green-600"
        >
          ✅
        </button>
        <button
          onClick={onReject}
          className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
        >
          ❌
        </button>
      </div>
    </div>
  );
};

export default IncomingCallToast;
