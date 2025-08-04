## 项目结构

```
System/
├── public/               # 静态资源
├── src/
│   ├── assets/           # 图片等资源文件
│   ├── components/       # 可复用组件
│   ├── data/             # 模拟数据
│   ├── pages/            # 页面组件
│   ├── router/           # 路由配置
│   ├── store/            # Redux状态管理
│   │   └── slices/       # Redux切片
│   ├── utils/            # 工具函数
│   ├── App.js            # 应用入口组件
│   └── index.js          # 渲染入口
├── server.js             # 后端服务（邮件发送）
└── package.json          # 项目依赖配置
```

## 核心功能模块


1. **HomePage**
   首页

2. **SimulationPage**
   单问题模拟页面

3. **CompoundPage**
   复合问题模拟页

4. **Navigation**
   导航栏
   
5. **Banner**
   轮播图
   
6. **DEGRADATION_TYPES的description**
   单降质问题简介



## 快速开始

### 前置要求

- Node.js (v14+)
- npm 或 yarn

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/xunvivi/System.git
cd System
```

2. 安装依赖
```bash
npm install
# 或
yarn install
```

3. 启动开发服务器
```bash
npm start
# 或
yarn start
```

4. 打开浏览器访问 `http://localhost:3000`

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

构建成果将输出到 `build` 目录，可直接部署到静态资源服务器。

## 后端服务

项目包含一个简单的后端服务用于处理邮件发送功能：

```bash
node server.js
```

服务将运行在 `http://localhost:5000`

