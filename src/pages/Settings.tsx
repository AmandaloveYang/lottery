import React, { useState } from "react";
import { Prize } from "../types";
import { useApp } from "../context/AppContext";
import Dialog from "../components/Dialog";

const Settings: React.FC = () => {
  const { setRemainingPrizes, prizes, setPrizes } = useApp();
  const [newPrize, setNewPrize] = useState({
    name: "",
    count: 1,
    level: 1,
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [dialog, setDialog] = useState({ isOpen: false, message: "" });

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

  return (
    <div className="space-y-6">
      <h2 className="mb-4 text-2xl font-bold">奖品设置</h2>

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
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  奖品名称
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  数量
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  等级
                </th>
                <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {prizes.map((prize) => (
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
                    {`${prize.level} 等奖`}
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
