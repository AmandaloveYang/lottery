# 抽奖系统

基于 React + Electron 的跨平台抽奖系统，支持奖品管理、参与者导入和抽奖记录。

## ✨ 功能特点

- 🎯 多等级奖品设置与管理
- 📊 Excel 批量导入参与者名单
- 🎲 流畅的实时抽奖动画效果
- 📝 完整的抽奖历史记录
- 💾 本地数据自动持久化
- 🖥️ 全平台支持 (Windows, macOS, Linux)

## 🛠️ 技术栈

- **前端框架**: React 18
- **开发语言**: TypeScript
- **桌面框架**: Electron
- **样式方案**: Tailwind CSS
- **路由管理**: React Router
- **数据处理**: XLSX

## 🚀 快速开始

### 开发环境配置

```bash
# 克隆项目
git clone
# 打开文件
cd lottery

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 启动 Electron
npm run electron:dev

# 打包应用
npm run electron:build
```

## 📖 使用指南

### 1. 奖品管理

- 进入"奖品设置"页面
- 添加/编辑奖品信息（名称、数量、等级）
- 支持实时编辑和删除

### 2. 参与者导入

- 进入"参与者"页面
- 下载 Excel 模板
- 填写并上传参与者信息（支持拖拽）

### 3. 抽奖流程

- 选择奖品等级
- 点击"开始抽奖"
- 等待动画完成，查看结果

### 4. 历史记录

- 查看完整抽奖记录
- 支持记录导出
- 数据本地持久化

## 📁 项目结构

```
src/
├── components/     # 可复用组件
├── pages/         # 页面组件
├── context/       # 状态管理
├── services/      # 业务服务
├── types/         # 类型定义
└── utils/         # 工具函数
```

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支：`git checkout -b feature/新功能`
3. 提交更改：`git commit -m '添加新功能'`
4. 推送分支：`git push origin feature/新功能`
5. 提交 Pull Request

## 📄 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 🙏 鸣谢

感谢所有为本项目做出贡献的开发者。
