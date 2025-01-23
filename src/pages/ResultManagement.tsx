import React, { useState, useEffect } from "react";

interface Winner {
  participantId: string;
  prizeId: string;
  prizeName: string;
  prizeLevel: number;
  winnerName: string;
  winnerDepartment: string;
  timestamp: string;
}

const ResultManagement: React.FC = () => {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    const savedWinners = JSON.parse(localStorage.getItem("winners") || "[]");
    setWinners(
      savedWinners.sort(
        (a: Winner, b: Winner) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
    );
  }, []);

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

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const handleClearHistory = () => {
    localStorage.removeItem("winners");
    setWinners([]);
    setShowConfirmDialog(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">中奖记录</h2>
        <div className="flex gap-4 items-center">
          <div className="text-gray-500">总计: {winners.length} 条记录</div>
          {winners.length > 0 && (
            <button
              onClick={() => setShowConfirmDialog(true)}
              className="px-4 py-2 text-sm text-red-600 rounded border border-red-600 hover:bg-red-50"
            >
              清空记录
            </button>
          )}
        </div>
      </div>

      {winners.length > 0 ? (
        <div className="overflow-hidden bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  中奖时间
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  中奖者
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  部门
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  奖品
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  奖品等级
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {winners.map((winner, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {formatTime(winner.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {winner.winnerName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {winner.winnerDepartment}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {winner.prizeName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {getLevelText(winner.prizeLevel)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
          暂无中奖记录
        </div>
      )}

      {showConfirmDialog && (
        <div className="flex fixed inset-0 justify-center items-center bg-black bg-opacity-50">
          <div className="p-6 bg-white rounded-lg shadow-xl">
            <h3 className="mb-4 text-lg font-semibold">确认清空</h3>
            <p className="mb-6 text-gray-600">
              确定要清空所有中奖记录吗？此操作不可撤销。
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 text-gray-600 rounded border hover:bg-gray-50"
              >
                取消
              </button>
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
              >
                确认清空
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultManagement;
