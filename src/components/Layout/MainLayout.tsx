import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

interface MenuItem {
  path: string;
  label: string;
  icon?: string; // 如果需要图标
}

const SIDE_MENU_ITEMS: MenuItem[] = [
  { path: "/lottery", label: "开始抽奖" },
  { path: "/prize-list", label: "奖品列表" },
  { path: "/participants", label: "参与者" },
];

const TOP_MENU_ITEMS: MenuItem[] = [
  { path: "/history", label: "历史记录" },
  { path: "/settings", label: "设置" },
];

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { participants, remainingPrizes } = useApp();

  // 如果是根路径，重定向到抽奖页面
  React.useEffect(() => {
    if (location.pathname === "/") {
      navigate("/lottery");
    }
  }, [location.pathname, navigate]);

  const isActive = (path: string) => {
    return location.pathname === path
      ? "bg-red-700 text-white"
      : "text-red-100 hover:bg-red-600";
  };

  // 根据当前路由显示不同的按钮
  const renderActionButton = () => {
    switch (location.pathname) {
      case "/lottery":
        return (
          <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
            开始抽奖
          </button>
        );
      case "/participants":
        return (
          <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
            导入名单
          </button>
        );
      case "/prize-list":
        return (
          <button className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
            添加奖品
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* 侧边栏 */}
      <div className="w-64 bg-red-500">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-white">抽奖系统</h1>
        </div>
        <nav className="mt-8">
          {SIDE_MENU_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`block px-4 py-2 ${isActive(item.path)}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 主内容区 */}
      <div className="flex flex-col flex-1">
        {/* 顶部导航栏 */}
        <header className="flex justify-between items-center px-6 h-16 bg-white border-b">
          <div className="flex items-center space-x-4">
            {renderActionButton()}
            {TOP_MENU_ITEMS.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded ${
                  location.pathname === item.path
                    ? "bg-red-500 text-white"
                    : "text-gray-600 hover:bg-red-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>

        {/* 内容区域 */}
        <main className="overflow-auto flex-1 p-6">{children}</main>

        {/* 底部状态栏 */}
        <footer className="flex items-center px-6 h-12 text-gray-600 bg-pink-50 border-t">
          <div className="flex-1">参与者：{participants.length}</div>
          <div className="flex-1 text-center">剩余奖品：{remainingPrizes}</div>
          <div className="flex-1 text-right">状态：就绪</div>
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
