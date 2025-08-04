import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CompoundPage from '../pages/CompoundPage';
import ModelsPage from '../pages/ModelsPage';
import ResearchPage from '../pages/ResearchPage';
import ResearchFocusPage from '../pages/ResearchfocusPage';
import SimulationPage from '../pages/SimulationPage'; 
import { Navigation } from '../components/Navigation';
import { Footer } from '../components/Footer';


const MainLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navigation />
    <main className="flex-grow">
      {children}
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <MainLayout>
        <HomePage />
      </MainLayout>
    ),
  },
  {
    path: '/compound',
    element: (
      <MainLayout>
        <CompoundPage />
      </MainLayout>
    ),
  },
  {
    path: '/single',
    element: (
      <MainLayout>
        <ModelsPage />
      </MainLayout>
    ),
  },
  {
    path: '/research',
    element: (
      <MainLayout>
        <ResearchPage />
      </MainLayout>
    ),
  },
  {
    path: '/focus',
    element: (
      <MainLayout>
        <ResearchFocusPage />
      </MainLayout>
    ),
  },
  {
    path: '/simulation/:id', // 动态匹配id（如blur、noise等）
    element: (
    <MainLayout>
      <SimulationPage /> 
    </MainLayout>  
    ),
  },
]);

// 路由提供者组件
const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;