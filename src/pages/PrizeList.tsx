import React from "react";
import { useApp } from "../context/AppContext";

const PrizeList: React.FC = () => {
  const { prizes } = useApp();

  // 按等级排序显示奖品
  const sortedPrizes = React.useMemo(() => {
    return [...prizes].sort((a, b) => {
      // 特别奖排在最前面
      if (a.level === 4) return -1;
      if (b.level === 4) return 1;
      return a.level - b.level;
    });
  }, [prizes]);

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

  if (!prizes) {
    return (
      <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
        加载中...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">奖品列表</h2>
      {sortedPrizes.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 w-1/3 text-xs font-medium text-left text-gray-500 uppercase">
                  奖品名称
                </th>
                <th className="px-6 py-3 w-1/3 text-xs font-medium text-left text-gray-500 uppercase">
                  奖品等级
                </th>
                <th className="px-6 py-3 w-1/3 text-xs font-medium text-left text-gray-500 uppercase">
                  数量
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedPrizes.map((prize) => (
                <tr key={prize.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{prize.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getLevelText(prize.level)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{prize.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500 bg-white rounded-lg shadow">
          暂无奖品，请先在设置中添加奖品
        </div>
      )}
    </div>
  );
};

export default PrizeList;
