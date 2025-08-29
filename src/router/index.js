import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// 导入各个页面组件
import HomePage from '../pages/HomePage';       // 首页
import CompoundPage from '../pages/CompoundPage'; // 复合页面
import SimulationPage from '../pages/SimulationPage'; // 模拟页面

// 导入公共组件
import { Navigation } from '../components/Navigation'; // 导航栏组件
import { Footer } from '../components/Footer';         // 页脚组件



// 定义主布局组件
// children参数用于接收子页面内容
const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navigation />  {/* 导航栏 - 在所有页面中显示 */}
    <main className="flex-grow"> {/* 主内容区 - 自动占据满中间空间 */}
      {children}  {/* 这里会显示当前路由对应的页面内容 */}
    </main>
    <Footer />  {/* 页脚 - 在所有页面中显示 */}
  </div>
);

// 创建路由配置
// 每个对象代表一个路由规则：path是访问路径，element是对应显示的组件
const router = createBrowserRouter([
  {
    path: '/',  // 根路径（网站首页）
    element: (
      <MainLayout>
        <HomePage />  {/* 首页内容会显示在MainLayout的children位置 */}
      </MainLayout>
    ),
  },
  {
    path: '/compound',  // 复合页面路径
    element: (
      <MainLayout>
        <CompoundPage />  {/* 复合页面内容 */}
      </MainLayout>
    ),
  },
  {
    // 动态路由：:id是变量
    path: '/simulation/:id', 
    element: (
      <MainLayout>
        <SimulationPage />  {/* 模拟页面内容（会根据id显示不同内容） */}
      </MainLayout>  
    ),
  },
]);

// 路由提供者组件（整个应用的路由入口）
const AppRouter = () => {
  // 将创建好的路由配置传给RouterProvider，让应用能使用这些路由规则
  return <RouterProvider router={router} />;
};

// 导出AppRouter组件，供应用入口文件使用（类似Python的包导出）
export default AppRouter;