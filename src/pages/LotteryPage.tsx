import { useState, useEffect, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { Participant } from "../types";

export default function LotteryPage() {
  const {
    participants,
    remainingPrizes,
    prizes,
    setPrizes,
    setRemainingPrizes,
    drawOrder,
  } = useApp();
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWinner, setCurrentWinner] = useState<Participant | null>(null);
  const [availableParticipants, setAvailableParticipants] = useState<
    Participant[]
  >([]);
  const [currentPrize, setCurrentPrize] = useState<string>("");

  // 修改初始化当前奖品的逻辑
  useEffect(() => {
    // 从localStorage获取已中奖名单，避免重复中奖
    const winners = JSON.parse(localStorage.getItem("winners") || "[]");
    const winnerIds = new Set(winners.map((w: any) => w.participantId));

    // 过滤掉已中奖的参与者
    const available = participants.filter((p) => !winnerIds.has(p.id));
    setAvailableParticipants(available);

    // 使用 getNextPrize 函数来设置当前要抽取的奖品
    const nextPrize = getNextPrize();
    if (nextPrize) {
      setCurrentPrize(`${nextPrize.name}(${getLevelText(nextPrize.level)})`);
    } else {
      setCurrentPrize("");
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

  // 修改 handleStartDraw 函数
  const handleStartDraw = () => {
    if (availableParticipants.length === 0) {
      alert("没有可参与抽奖的人员");
      return;
    }
    if (remainingPrizes <= 0) {
      alert("已经没有可抽取的奖品了");
      return;
    }

    // 开始抽奖前更新当前奖品显示
    const nextPrize = getNextPrize();
    if (nextPrize) {
      setCurrentPrize(`${nextPrize.name}(${getLevelText(nextPrize.level)})`);
    }

    setIsDrawing(true);
  };

  // 根据设置的抽奖顺序获取下一个要抽取的奖品
  const getNextPrize = () => {
    const availablePrizes = prizes.filter((p) => p.count > 0);

    if (drawOrder === "random") {
      // 随机抽取任意奖品
      return availablePrizes[
        Math.floor(Math.random() * availablePrizes.length)
      ];
    } else {
      // 按等级排序
      const sortedPrizes = [...availablePrizes].sort((a, b) => {
        const aLevel = a.level === 4 ? -1 : a.level;
        const bLevel = b.level === 4 ? -1 : b.level;
        return drawOrder === "level-desc" ? aLevel - bLevel : bLevel - aLevel;
      });
      return sortedPrizes[0];
    }
  };

  // 修改停止抽奖的逻辑
  const handleStopDraw = () => {
    setIsDrawing(false);
    const nextPrize = getNextPrize();
    if (nextPrize && currentWinner) {
      // 更新奖品数量
      const updatedPrizes = prizes.map((prize) =>
        prize.id === nextPrize.id ? { ...prize, count: prize.count - 1 } : prize
      );
      setPrizes(updatedPrizes);
      setRemainingPrizes((prev) => prev - 1);

      // 保存中奖记录
      const winners = JSON.parse(localStorage.getItem("winners") || "[]");
      winners.push({
        participantId: currentWinner.id,
        prizeId: nextPrize.id,
        prizeName: nextPrize.name,
        prizeLevel: nextPrize.level,
        winnerName: currentWinner.name,
        winnerDepartment: currentWinner.department,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("winners", JSON.stringify(winners));

      // 更新当前奖品显示
      const nextAvailablePrize = getNextPrize();
      if (nextAvailablePrize) {
        setCurrentPrize(
          `${nextAvailablePrize.name}(${getLevelText(
            nextAvailablePrize.level
          )})`
        );
      } else {
        setCurrentPrize("");
      }

      // 更新可用参与者列表
      setAvailableParticipants((prev) =>
        prev.filter((p) => p.id !== currentWinner.id)
      );
    }
  };

  // 计算每个等级的剩余奖品数量
  const remainingPrizesByLevel = useMemo(() => {
    const result: { [key: number]: number } = {};
    prizes.forEach((prize) => {
      if (prize.count > 0) {
        result[prize.level] = (result[prize.level] || 0) + prize.count;
      }
    });
    return result;
  }, [prizes]);

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

        {/* 添加奖品等级剩余数量显示 */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {Object.entries(remainingPrizesByLevel).map(([level, count]) => (
            <div
              key={level}
              className="px-4 py-2 text-center bg-gray-50 rounded-lg"
            >
              <div className="text-sm text-gray-500">
                {getLevelText(Number(level))}
              </div>
              <div className="mt-1 text-lg font-medium text-gray-700">
                剩余 {count}
              </div>
            </div>
          ))}
        </div>

        <div className="text-sm text-gray-500">
          参与者: {availableParticipants.length} | 总剩余奖品: {remainingPrizes}
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex space-x-4">
        <button
          onClick={() => (isDrawing ? handleStopDraw() : handleStartDraw())}
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
