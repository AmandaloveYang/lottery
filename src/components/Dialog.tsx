import React from "react";
import { Dialog as HeadlessDialog } from "@headlessui/react";
import { Button } from "./Button";

interface DialogProps {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onConfirm?: () => void;
}

const Dialog: React.FC<DialogProps> = ({
  isOpen,
  message,
  onClose,
  onConfirm,
}) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  return (
    <HeadlessDialog open={isOpen} onClose={onClose} className="relative z-50">
      {/* 背景遮罩 */}
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

      {/* 全屏容器来居中面板 */}
      <div className="flex fixed inset-0 justify-center items-center p-4 w-screen">
        {/* 实际的对话框面板 */}
        <div className="overflow-hidden p-6 w-full max-w-md bg-white rounded-lg shadow-xl transform">
          <div className="mb-4 text-lg font-medium">提示</div>

          <div className="mt-2">
            <p className="text-sm text-gray-500">{message}</p>
          </div>

          <div className="flex justify-end mt-4">
            {onConfirm ? (
              <>
                <Button variant="secondary" onClick={onClose} className="mr-2">
                  取消
                </Button>
                <Button onClick={handleConfirm}>确定</Button>
              </>
            ) : (
              <Button onClick={onClose}>确定</Button>
            )}
          </div>
        </div>
      </div>
    </HeadlessDialog>
  );
};

export default Dialog;
