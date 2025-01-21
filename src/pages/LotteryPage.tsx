import { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Participant } from "../types";

export default function LotteryPage() {
  const { participants, remainingPrizes, prizes } = useApp();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [availableParticipants, setAvailableParticipants] = useState<
    Participant[]
  >([]);
  const [currentPrize, setCurrentPrize] = useState<string>("");

  // 初始化可用参与者列表和当前奖品
  useEffect(() => {
    // 从localStorage获取已中奖名单，避免重复中奖
    const winners = JSON.parse(localStorage.getItem("winners") || "[]");
    const winnerIds = new Set(winners.map((w: any) => w.participantId));

    // 过滤掉已中奖的参与者
    const available = participants.filter((p) => !winnerIds.has(p.id));
    setAvailableParticipants(available);

    // 设置当前要抽取的奖品
    const remainingPrize = prizes.find((p) => p.count > 0);
    if (remainingPrize) {
      setCurrentPrize(
        `${remainingPrize.name}(${getLevelText(remainingPrize.level)})`
      );
    }
  }, [participants, prizes]);

  const getLevelText = (level: number) => {
    switch (level) {
      case 1:
        return "一等奖";
      case 2:
        return "二等奖";
      case 3:
        return "三等奖";
      case 4:
        return "特别奖";
      default:
        return `${level}等奖`;
    }
  };

  // 模拟抽奖过程
  useEffect(() => {
    if (isDrawing && availableParticipants.length > 0) {
      const timer = setInterval(() => {
        const randomIndex = Math.floor(
          Math.random() * availableParticipants.length
        );
        setCurrentWinner(availableParticipants[randomIndex]);
      }, 100);
      return () => clearInterval(timer);
    }
  }, [isDrawing, availableParticipants]);

  const handleStartDraw = () => {
    if (availableParticipants.length === 0) {
      alert("没有可参与抽奖的人员");
      return;
    }
    if (remainingPrizes <= 0) {
      alert("已经没有可抽取的奖品了");
      return;
    }
    setIsDrawing(true);
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center space-y-8">
      {/* 抽奖展示区 */}
      <div className="flex flex-col justify-center items-center p-8 space-y-4 w-full max-w-2xl bg-white rounded-2xl shadow-xl aspect-video">
        {/* 显示当前奖品 */}
        <div className="mb-4 text-xl text-gray-600">
          {currentPrize ? `正在抽取: ${currentPrize}` : "暂无可抽取奖品"}
        </div>

        <div
          className={`text-4xl font-bold transition-all duration-500 ${
            isDrawing ? "text-rose-500 animate-bounce" : "text-gray-800"
          }`}
        >
          {isDrawing
            ? "抽奖中..."
            : currentWinner
            ? `${currentWinner.name} (${currentWinner.department})`
            : "等待开始"}
        </div>

        <div className="text-sm text-gray-500">
          参与者: {availableParticipants.length} | 剩余奖品: {remainingPrizes}
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex space-x-4">
        <button
          onClick={() => (isDrawing ? setIsDrawing(false) : handleStartDraw())}
          className={`px-8 py-3 rounded-full font-medium text-white shadow-lg transition-all
            ${
              isDrawing
                ? "bg-rose-500 hover:bg-rose-600 shadow-rose-200"
                : "bg-teal-500 hover:bg-teal-600 shadow-teal-200"
            }`}
          disabled={availableParticipants.length === 0 || remainingPrizes <= 0}
        >
          {isDrawing ? "停止" : "开始抽奖"}
        </button>
      </div>

      {/* 状态栏 */}
      <div className="fixed right-0 bottom-0 left-0 border-t border-gray-200 backdrop-blur-sm bg-white/80">
        <div className="flex justify-between items-center px-4 mx-auto max-w-7xl h-12 text-sm text-gray-500">
          <div>参与者：{availableParticipants.length}</div>
          <div>剩余奖品：{remainingPrizes}</div>
          <div>状态：{isDrawing ? "抽奖中" : "就绪"}</div>
        </div>
      </div>
    </div>
  );
}
