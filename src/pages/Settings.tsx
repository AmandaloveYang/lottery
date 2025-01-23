import React, { useState } from "react";
import { Prize } from "../types";
import { useApp } from "../context/AppContext";
import Dialog from "../components/Dialog";

const Settings: React.FC = () => {
  const { setRemainingPrizes, prizes, setPrizes, setDrawOrder } = useApp();
  const [newPrize, setNewPrize] = useState({
    name: "",
    count: 1,
    level: 1,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState({ isOpen: false, message: "" });
  const [sortConfig, setSortConfig] = useState<{
    key: "count" | "level";
    direction: "asc" | "desc" | null;
  }>({ key: "level", direction: "desc" });

  // 添加抽奖顺序设置
  const [drawOrder, setDrawOrderState] = useState(() => {
    // 从 localStorage 获取保存的设置，默认按等级从高到低
    return localStorage.getItem("drawOrder") || "level-desc";
  });

  const sortedPrizes = React.useMemo(() => {
    const sortedItems = [...prizes];
    if (sortConfig.direction !== null) {
      sortedItems.sort((a, b) => {
        if (sortConfig.key === "level") {
          // 特别处理等级排序
          const aLevel = a.level === 4 ? -1 : a.level; // 特别奖排在最前面
          const bLevel = b.level === 4 ? -1 : b.level;

          if (aLevel < bLevel) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (aLevel > bLevel) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        } else {
          // 其他字段正常排序
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "asc" ? 1 : -1;
          }
          return 0;
        }
      });
    }
    return sortedItems;
  }, [prizes, sortConfig]);

  const requestSort = (key: "count" | "level") => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") {
        direction = "desc";
      } else if (sortConfig.direction === "desc") {
        direction = "asc";
      }
    } else if (key === "level") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleAddPrize = () => {
    if (!newPrize.name.trim()) {
      setDialog({ isOpen: true, message: "请输入奖品名称" });
      return;
    }

    const prize: Prize = {
      id: crypto.randomUUID(),
      name: newPrize.name,
      count: newPrize.count,
      level: newPrize.level,
    };

    setPrizes([...prizes, prize]);
    setRemainingPrizes((prev) => prev + newPrize.count);
    setNewPrize({ name: "", count: 1, level: 1 });
  };

  const handleDeletePrize = (id: string) => {
    const prize = prizes.find((p) => p.id === id);
    if (prize) {
      setPrizes(prizes.filter((p) => p.id !== id));
      setRemainingPrizes((prev) => prev - prize.count);
    }
  };

  const handleEditPrize = (prize: Prize) => {
    if (!prize.name.trim()) {
      setDialog({ isOpen: true, message: "请输入奖品名称" });
      return;
    }

    const updatedPrizes = prizes.map((p) => {
      if (p.id === prize.id) {
        return prize;
      }
      return p;
    });
    setPrizes(updatedPrizes);
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, prize: Prize) => {
    if (e.key === "Enter") {
      handleEditPrize(prize);
    } else if (e.key === "Escape") {
      setEditingId(null);
    }
  };

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

  // 修改抽奖顺序设置
  const handleDrawOrderChange = (order: string) => {
    setDrawOrderState(order);
    setDrawOrder(order); // 同步到 Context
    localStorage.setItem("drawOrder", order);

    // 显示对应的提示消息
    let message = "";
    switch (order) {
      case "level-desc":
        message = "已设置为按奖品等级从高到低的顺序抽奖";
        break;
      case "level-asc":
        message = "已设置为按奖品等级从低到高的顺序抽奖";
        break;
      case "random":
        message = "已设置为随机抽取奖品";
        break;
    }
    setDialog({ isOpen: true, message });
  };

  return (
    <div className="space-y-6">
      <h2 className="mb-4 text-2xl font-bold">奖品设置</h2>

      {/* 添加抽奖顺序设置区域 */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-semibold">抽奖顺序设置</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">
              抽奖顺序
            </label>
            <select
              value={drawOrder}
              onChange={(e) => handleDrawOrderChange(e.target.value)}
              className="px-3 py-2 rounded-md border"
            >
              <option value="level-desc">按奖品等级从高到低</option>
              <option value="level-asc">按奖品等级从低到高</option>
              <option value="random">随机抽取</option>
            </select>
          </div>
          <p className="text-sm text-gray-500">
            {drawOrder === "level-desc" &&
              "将按照奖品等级从高到低的顺序进行抽奖（特别奖 → 一等奖 → 二等奖 → 三等奖）"}
            {drawOrder === "level-asc" &&
              "将按照奖品等级从低到高的顺序进行抽奖（三等奖 → 二等奖 → 一等奖 → 特别奖）"}
            {drawOrder === "random" && "将随机抽取任意等级的奖品"}
          </p>
        </div>
      </div>

      {/* 添加奖品表单 */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-semibold">添加奖品</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              奖品名称
            </label>
            <input
              type="text"
              value={newPrize.name}
              onChange={(e) =>
                setNewPrize({ ...newPrize, name: e.target.value })
              }
              className="px-3 py-2 w-full rounded-md border"
              placeholder="请输入奖品名称"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              数量
            </label>
            <input
              type="number"
              min="1"
              value={newPrize.count}
              onChange={(e) =>
                setNewPrize({
                  ...newPrize,
                  count: parseInt(e.target.value) || 1,
                })
              }
              className="px-3 py-2 w-full rounded-md border"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              等级
            </label>
            <select
              value={newPrize.level}
              onChange={(e) =>
                setNewPrize({ ...newPrize, level: parseInt(e.target.value) })
              }
              className="px-3 py-2 w-full rounded-md border"
            >
              <option value={1}>一等奖</option>
              <option value={2}>二等奖</option>
              <option value={3}>三等奖</option>
              <option value={4}>特别奖</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddPrize}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              添加
            </button>
          </div>
        </div>
      </div>

      {/* 奖品列表 */}
      {prizes.length > 0 && (
        <div className="bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 w-1/3 text-xs font-medium text-left text-gray-500 uppercase">
                  奖品名称
                </th>
                <th
                  className="px-6 py-3 w-1/4 text-xs font-medium text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("count")}
                >
                  数量
                  {sortConfig.key === "count" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th
                  className="px-6 py-3 w-1/4 text-xs font-medium text-left text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("level")}
                >
                  等级
                  {sortConfig.key === "level" && (
                    <span className="ml-1">
                      {sortConfig.direction === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </th>
                <th className="px-6 py-3 w-1/6 text-xs font-medium text-left text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedPrizes.map((prize) => (
                <tr key={prize.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {editingId === prize.id ? (
                      <input
                        type="text"
                        value={prize.name}
                        onChange={(e) => {
                          const newPrize = { ...prize, name: e.target.value };
                          setPrizes(
                            prizes.map((p) =>
                              p.id === prize.id ? newPrize : p
                            )
                          );
                        }}
                        onKeyDown={(e) => handleKeyDown(e, prize)}
                        className="px-2 py-1 w-full rounded border"
                        autoFocus
                        onBlur={(e) => {
                          if (!e.target.value.trim()) {
                            e.target.focus();
                            alert("请输入奖品名称");
                            return;
                          }
                          handleEditPrize(prize);
                        }}
                      />
                    ) : (
                      <span
                        className="cursor-pointer hover:text-blue-600"
                        onClick={() => setEditingId(prize.id)}
                      >
                        {prize.name}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{prize.count}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getLevelText(prize.level)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleDeletePrize(prize.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      删除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog
        isOpen={dialog.isOpen}
        message={dialog.message}
        onClose={() => setDialog({ isOpen: false, message: "" })}
      />
    </div>
  );
};

export default Settings;
