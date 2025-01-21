import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();

  const navItems = [
    { name: "开始抽奖", path: "/" },
    { name: "奖品列表", path: "/prizes" },
    { name: "参与者", path: "/participants" },
    { name: "历史记录", path: "/history" },
    { name: "设置", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50">
      {/* 顶部导航栏 */}
      <nav className="fixed z-10 w-full border-b border-gray-200 backdrop-blur-sm bg-white/80">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-teal-500">
                抽奖系统
              </span>
            </div>
            <div className="flex space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${
                    location.pathname === item.path
                      ? "text-rose-500 border-b-2 border-rose-500"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <main className="pt-16">
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
