import React, { useState, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";
import { ParticipantExcel } from "../types/excel";
import { Participant } from "../types";
import { useApp } from "../context/AppContext";

const ParticipantManagement: React.FC = () => {
  const { setParticipants } = useApp();
  const [localParticipants, setLocalParticipants] = useState<Participant[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newParticipant, setNewParticipant] = useState({
    employeeId: "",
    name: "",
    department: "",
  });

  // 从 localStorage 加载数据
  useEffect(() => {
    const savedParticipants = localStorage.getItem("participants");
    if (savedParticipants) {
      const parsedParticipants = JSON.parse(savedParticipants);
      setLocalParticipants(parsedParticipants);
      setParticipants(parsedParticipants);
    }
  }, []);

  // 保存数据到 localStorage
  const saveParticipants = (participants: Participant[]) => {
    localStorage.setItem("participants", JSON.stringify(participants));
    setLocalParticipants(participants);
    setParticipants(participants);
  };

  const handleExcelData = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<ParticipantExcel>(worksheet);

      // 检查新导入的数据中是否有重复工号
      const duplicateIds = jsonData
        .map((row) => row.工号)
        .filter((id, index, self) => self.indexOf(id) !== index);

      // 检查与现有数据是否有重复工号
      const existingDuplicates = jsonData.filter((row) =>
        localParticipants.some((p) => p.employeeId === row.工号)
      );

      if (duplicateIds.length > 0 || existingDuplicates.length > 0) {
        let message = "";
        if (duplicateIds.length > 0) {
          message += `Excel 文件中存在重复工号: ${duplicateIds.join(", ")}\n`;
        }
        if (existingDuplicates.length > 0) {
          message += `以下工号与现有参与者重复: ${existingDuplicates
            .map((row) => row.工号)
            .join(", ")}`;
        }
        alert(message);
        return;
      }

      const newParticipants = jsonData.map((row) => ({
        id: crypto.randomUUID(),
        name: row.姓名,
        department: row.部门,
        employeeId: row.工号,
      }));

      saveParticipants(newParticipants);
    } catch (error) {
      console.error("Excel 解析错误:", error);
      alert("Excel 格式不正确，请使用正确的模板");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleExcelData(file);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".xlsx") || file.name.endsWith(".xls"))) {
      handleExcelData(file);
    } else {
      alert("请上传 Excel 文件 (.xlsx 或 .xls)");
    }
  }, []);

  // 下载模板功能
  const downloadTemplate = () => {
    const template = [
      {
        工号: "001",
        姓名: "张三（示例）",
        部门: "技术部",
        职位: "工程师",
      },
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "参与者名单");

    // 设置列宽
    ws["!cols"] = [
      { wch: 10 }, // 工号
      { wch: 15 }, // 姓名
      { wch: 15 }, // 部门
      { wch: 15 }, // 职位
    ];

    XLSX.writeFile(wb, "抽奖系统-参与者模板.xlsx");
  };

  // 添加新参与者
  const handleAddParticipant = () => {
    if (!newParticipant.employeeId.trim() || !newParticipant.name.trim()) {
      alert("请填写工号和姓名");
      return;
    }

    const isDuplicate = localParticipants.some(
      (p) => p.employeeId === newParticipant.employeeId.trim()
    );
    if (isDuplicate) {
      alert(`工号 ${newParticipant.employeeId} 已存在`);
      return;
    }

    const participant: Participant = {
      id: crypto.randomUUID(),
      ...newParticipant,
    };

    const updatedParticipants = [...localParticipants, participant];
    saveParticipants(updatedParticipants);
    setNewParticipant({ employeeId: "", name: "", department: "" });
  };

  // 删除参与者
  const handleDeleteParticipant = (id: string) => {
    const updatedParticipants = localParticipants.filter((p) => p.id !== id);
    saveParticipants(updatedParticipants);
  };

  // 编辑参与者
  const handleEditParticipant = (participant: Participant) => {
    if (!participant.employeeId.trim() || !participant.name.trim()) {
      alert("请填写工号和姓名");
      return;
    }

    const updatedParticipants = localParticipants.map((p) =>
      p.id === participant.id ? participant : p
    );
    saveParticipants(updatedParticipants);
    setEditingId(null);
  };

  // 添加清空参与者列表的功能
  const handleClearParticipants = () => {
    if (window.confirm("确定要清空所有参与者吗？此操作不可恢复。")) {
      saveParticipants([]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">参与者管理</h2>
        {localParticipants.length > 0 && (
          <button
            onClick={handleClearParticipants}
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600"
          >
            清空名单
          </button>
        )}
      </div>

      {/* 添加参与者表单 */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-semibold">添加参与者</h3>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              工号
            </label>
            <input
              type="text"
              value={newParticipant.employeeId}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  employeeId: e.target.value,
                })
              }
              className="px-3 py-2 w-full rounded-md border"
              placeholder="请输入工号"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              姓名
            </label>
            <input
              type="text"
              value={newParticipant.name}
              onChange={(e) =>
                setNewParticipant({ ...newParticipant, name: e.target.value })
              }
              className="px-3 py-2 w-full rounded-md border"
              placeholder="请输入姓名"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              部门
            </label>
            <input
              type="text"
              value={newParticipant.department}
              onChange={(e) =>
                setNewParticipant({
                  ...newParticipant,
                  department: e.target.value,
                })
              }
              className="px-3 py-2 w-full rounded-md border"
              placeholder="请输入部门"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddParticipant}
              className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
            >
              添加
            </button>
          </div>
        </div>
      </div>

      {/* Excel导入区域 */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="mb-4 text-lg font-semibold">批量导入</h3>
        <div
          className={`p-6 text-center rounded-lg border-2 border-dashed transition-colors ${
            isDragging
              ? "bg-red-50 border-red-500"
              : "border-gray-300 hover:border-red-500"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <button
              onClick={downloadTemplate}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              下载Excel模板
            </button>

            <div>
              <input
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileUpload}
                className="hidden"
                id="excel-upload"
              />
              <label
                htmlFor="excel-upload"
                className="px-4 py-2 text-white bg-red-500 rounded cursor-pointer hover:bg-red-600"
              >
                上传 Excel
              </label>
              <p className="mt-2 text-sm text-gray-500">
                支持 .xlsx 或 .xls 格式
              </p>
              <p className="mt-1 text-sm text-gray-400">或将文件拖放到此处</p>
            </div>
          </div>
        </div>
      </div>

      {/* 参与者列表 */}
      {localParticipants.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">
            已导入 {localParticipants.length} 名参与者
          </h3>
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 w-1/4 text-xs font-medium text-left text-gray-500 uppercase">
                    工号
                  </th>
                  <th className="px-6 py-3 w-1/4 text-xs font-medium text-left text-gray-500 uppercase">
                    姓名
                  </th>
                  <th className="px-6 py-3 w-1/3 text-xs font-medium text-left text-gray-500 uppercase">
                    部门
                  </th>
                  <th className="px-6 py-3 w-1/6 text-xs font-medium text-left text-gray-500 uppercase">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {localParticipants.map((participant) => (
                  <tr key={participant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === participant.id ? (
                        <input
                          type="text"
                          value={participant.employeeId}
                          onChange={(e) => {
                            const updated = {
                              ...participant,
                              employeeId: e.target.value,
                            };
                            setLocalParticipants(
                              localParticipants.map((p) =>
                                p.id === participant.id ? updated : p
                              )
                            );
                          }}
                          className="px-2 py-1 w-full rounded border"
                        />
                      ) : (
                        participant.employeeId
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === participant.id ? (
                        <input
                          type="text"
                          value={participant.name}
                          onChange={(e) => {
                            const updated = {
                              ...participant,
                              name: e.target.value,
                            };
                            setLocalParticipants(
                              localParticipants.map((p) =>
                                p.id === participant.id ? updated : p
                              )
                            );
                          }}
                          className="px-2 py-1 w-full rounded border"
                        />
                      ) : (
                        participant.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === participant.id ? (
                        <input
                          type="text"
                          value={participant.department}
                          onChange={(e) => {
                            const updated = {
                              ...participant,
                              department: e.target.value,
                            };
                            setLocalParticipants(
                              localParticipants.map((p) =>
                                p.id === participant.id ? updated : p
                              )
                            );
                          }}
                          className="px-2 py-1 w-full rounded border"
                        />
                      ) : (
                        participant.department
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === participant.id ? (
                        <div className="space-x-2">
                          <button
                            onClick={() => handleEditParticipant(participant)}
                            className="text-green-600 hover:text-green-900"
                          >
                            保存
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            取消
                          </button>
                        </div>
                      ) : (
                        <div className="space-x-2">
                          <button
                            onClick={() => setEditingId(participant.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            编辑
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteParticipant(participant.id)
                            }
                            className="text-red-600 hover:text-red-900"
                          >
                            删除
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantManagement;
