import { Close } from "@mui/icons-material";
import { X } from "lucide-react";
import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#01010188] flex items-center justify-center z-100">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer"
          >
            <X />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
