import React from "react";
import { Dialog as HeadlessDialog } from "@headlessui/react";

interface DialogProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
}

const Dialog: React.FC<DialogProps> = ({ isOpen, message, onClose }) => {
  return (
    <HeadlessDialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* 对话框容器 */}
      <div className="flex fixed inset-0 justify-center items-center p-4">
        <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-xl">
          <div className="mb-4 text-base">{message}</div>
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
    </HeadlessDialog>
  );
};

export default Dialog;
