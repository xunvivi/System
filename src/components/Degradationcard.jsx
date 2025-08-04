import React from 'react';
import { Link } from 'react-router-dom';

const Degradationcard = ({ model }) => {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      {/* 卡片顶部图标区域 */}
      <div className="h-48 bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
        <i className={model.iconClass}></i>
      </div>
      
      {/* 卡片内容区域 */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2">{model.name}</h3>
        <p className="text-slate-600 mb-4">{model.description}</p>
        
       {/* 跳转链接 - 开始模拟 */}
      <Link to={`/simulation/${model.id}`} className="text-blue-600 hover:text-blue-700 transition-colors flex items-center">
       开始模拟 <i className="fa fa-play ml-2"></i>
      </Link>
      </div>
    </div>
  );
};

export default Degradationcard;
