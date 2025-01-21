import React from "react";

interface DialogProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, message, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-30"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg p-6 shadow-xl">
        <p className="mb-4">{message}</p>
        <div className="text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
