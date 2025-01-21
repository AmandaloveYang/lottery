import { useState, useEffect } from "react";

export default function LotteryPage() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWinner, setCurrentWinner] = useState("");

  // 模拟抽奖过程
  useEffect(() => {
    if (isDrawing) {
      const names = ["张三", "李四", "王五", "赵六"]; // 示例参与者
      const timer = setInterval(() => {
        setCurrentWinner(names[Math.floor(Math.random() * names.length)]);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isDrawing]);

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center space-y-8">
      {/* 抽奖展示区 */}
      <div className="flex flex-col justify-center items-center p-8 space-y-4 w-full max-w-2xl bg-white rounded-2xl shadow-xl aspect-video">
        <div
          className={`text-4xl font-bold transition-all duration-500 ${
            isDrawing ? "text-rose-500 animate-bounce" : "text-gray-800"
          }`}
        >
          {isDrawing ? "抽奖中..." : currentWinner || "等待开始"}
        </div>

        <div className="text-sm text-gray-500">参与者: 0 | 剩余奖品: 0</div>
      </div>

      {/* 控制按钮 */}
      <div className="flex space-x-4">
        <button
          onClick={() => setIsDrawing(!isDrawing)}
          className={`px-8 py-3 rounded-full font-medium text-white shadow-lg transition-all
            ${
              isDrawing
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
                : "bg-teal-500 hover:bg-teal-600 shadow-teal-200"
            }`}
        >
          {isDrawing ? "停止" : "开始抽奖"}
        </button>
      </div>

      {/* 状态栏 */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 backdrop-blur-sm bg-white/80">
        <div className="flex justify-between items-center px-4 mx-auto max-w-7xl h-12 text-sm text-gray-500">
          <div>参与者：0</div>
          <div>剩余奖品：0</div>
          <div>状态：就绪</div>
        </div>
      </div>
    </div>
  );
}
