import React from 'react';
import { Link } from 'react-router-dom';
import BannerCarousel from '../components/Banner';
import ResearchAreaCard from '../components/ResearchAreaCard';
import researchAreas from '../data/researchData';
import degradationItems from '../data/degradationItems';
import Degradationcard from '../components/Degradationcard';

const HomePage = () => {
  return (
    <div>
      {/* 英雄区域 */}
      <section className="pt-32 pb-16">
        <div className="container mx-auto px-4">
          <BannerCarousel />
        </div>
      </section>

      {/* 单问题预览部分 */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-[clamp(1.8rem,4vw,2.5rem)] font-bold mb-4">单个降质问题模拟展示</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              该部分展示了单个降质问题的模拟过程，包括问题描述、问题分析、问题解决方案等内容。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {degradationItems.map((item) => (
              <Degradationcard key={item.id} model={item} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/models" className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors">
              View all models <i className="fa fa-arrow-right ml-2"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* 复合降质部分 */}
      <section className="py-16 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-xl shadow-sm p-8 md:p-12 border border-slate-200">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/2">
                <span className="text-blue-600 font-semibold">多阶段处理</span>
                <h3 className="text-2xl md:text-3xl font-bold mt-2 mb-4">复合退化过程模拟展示</h3>
                <p className="text-slate-600 mb-6">
                  进行多阶段的复合降质处理，包括必选的第一阶和第二阶处理，以及可选的第三阶处理，模拟真实场景中的复杂降质过程。
                </p>
                <Link to="/compound" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors">
                  进入复合降质处理
                </Link>
              </div>
              <div className="md:w-1/2">
                <div className="w-full h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center">
                  <i className="fa fa-users text-8xl text-blue-600/20"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
