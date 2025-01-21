import React, { useState, useCallback } from "react";
import * as XLSX from "xlsx";
import { ParticipantExcel } from "../types/excel";
import { Participant } from "../types";
import { useApp } from "../context/AppContext";

const ParticipantManagement: React.FC = () => {
  const { setParticipants } = useApp();
  const [localParticipants, setLocalParticipants] = useState<Participant[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleExcelData = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<ParticipantExcel>(worksheet);

      const newParticipants = jsonData.map((row) => ({
        id: crypto.randomUUID(),
        name: row.姓名,
        department: row.部门,
        employeeId: row.工号,
      }));

      setLocalParticipants(newParticipants);
      setParticipants(newParticipants);
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

  return (
    <div className="space-y-4">
      <h2 className="mb-4 text-2xl font-bold">参与者管理</h2>

      {/* 上传区域 */}
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
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    工号
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    姓名
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-left text-gray-500 uppercase">
                    部门
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {localParticipants.map((participant) => (
                  <tr key={participant.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {participant.department}
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
