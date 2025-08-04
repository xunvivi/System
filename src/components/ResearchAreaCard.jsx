import { Link } from 'react-router-dom'; // 

const ResearchAreaCard = ({ area }) => {

  const highlights = area?.highlights || [];
  
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-4">
          {/* 补充：对 iconClass 做空值保护，避免渲染错误 */}
          <i className={area?.iconClass || ''}></i>
        </div>
        {/* 补充：对标题和描述做空值保护，避免显示 undefined */}
        <h3 className="text-xl font-bold mb-3">{area?.title || '未命名'}</h3>
        <p className="text-slate-600 mb-4">{area?.description || '无描述'}</p>
        <ul className="space-y-2 mb-6">
          {/* 使用处理后的 highlights 数组，确保可安全调用 map */}
          {highlights.map((highlight, index) => (
            <li key={index} className="flex items-start">
              <i className="fa fa-check text-green-500 mt-1 mr-3"></i>
              <span className="text-slate-700">{highlight}</span>
            </li>
          ))}
        </ul>
        <Link to={`/focus#${area?.id}`} className="text-blue-600 hover:text-blue-700 transition-colors flex items-center">
          Explore research area <i className="fa fa-arrow-right ml-2"></i>
        </Link>
      </div>
    </div>
  );
};

export default ResearchAreaCard;
