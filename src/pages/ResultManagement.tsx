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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">中奖记录</h2>
        <div className="text-gray-500">总计: {winners.length} 条记录</div>
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
    </div>
  );
};

export default ResultManagement;
