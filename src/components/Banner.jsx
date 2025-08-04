import { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap"; 
import bgImage1 from "../assets/img/bg1.jpg";
import bgImage2 from "../assets/img/bg2.jpg";
import bgImage3 from "../assets/img/bg3.jpg";
import bgImage4 from "../assets/img/bg4.jpg";
import { ArrowRightCircle } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  // 轮播数据，每个幻灯片可以设置不同的背景图
  const slides = [
    {
      tag: 'Degradation Model Visualization and Display System',
      title: '退化模型可视化系统',
      description: '支持12个独立的单降质问题处理以及复合的三阶段降质问题处理',
      buttonText: '立即开始',
      buttonColor: 'bg-blue-600 hover:bg-blue-700',
      bgImage: bgImage1  // 第一张幻灯片的背景图
    },
    {
      tag: 'Degradation Model Visualization and Display System',
      title: '退化模型可视化系统',
      description: '支持12个独立的单降质问题处理以及复合的三阶段降质问题处理',
      buttonText: '立即开始',
      buttonColor: 'bg-slate-800 hover:bg-slate-900',
      bgImage: bgImage2  // 第二张幻灯片的背景图
    },
    {
      tag: 'Degradation Model Visualization and Display System',
      title: '退化模型可视化系统',
      description: '支持12个独立的单降质问题处理以及复合的三阶段降质问题处理',
      buttonText: '立即开始',
      buttonColor: 'bg-slate-800 hover:bg-slate-900',
      bgImage: bgImage3  // 第三张幻灯片的背景图
    },
    {
      tag: 'Degradation Model Visualization and Display System',
      title: '退化模型可视化系统',
      description: '支持12个独立的单降质问题处理以及复合的三阶段降质问题处理',
      buttonText: '立即开始',
      buttonColor: 'bg-slate-800 hover:bg-slate-900',
      bgImage: bgImage4  // 第四张幻灯片的背景图
    }
  ];

  // 自动轮播逻辑
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    // 组件卸载时清除定时器，防止内存泄漏
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="h-[550px] relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
      {/* 遍历轮播项 */}
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide 
              ? 'opacity-100 translate-x-0' 
              : 'opacity-0 translate-x-full'
          }`}
          // 设置背景图样式
          style={{
            backgroundImage: `url(${slide.bgImage})`,  // 使用当前幻灯片的背景图
            backgroundSize: 'cover',  // 图片自适应容器大小
            backgroundPosition: 'center',  // 图片居中显示
            backgroundRepeat: 'no-repeat'  // 图片不重复平铺
          }}
        >
          <div className="h-full flex flex-col md:flex-row relative z-10">
            {/* 左侧文案区域 */}
            <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
              <span className="text-blue-600 font-semibold mb-4 bg-white/80 px-3 py-1 rounded-full w-fit">
                {slide.tag}
              </span>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-6 text-slate-800">
                {slide.title}
              </h2>
              <p className="text-slate-700 text-lg max-w-xl mb-8 bg-white/60 px-4 py-2 rounded-lg">
                {slide.description}
              </p>
              <button 
                className={`${slide.buttonColor} text-white px-8 py-3 rounded-lg font-medium transition-opacity w-fit`}
              >
                {slide.buttonText}
              </button>
            </div>
            
            {/* 右侧区域 - 已移除白色框，改为极简图形直接展示 */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-8">
              {/* 极简风格的图形元素，与整体设计呼应 */}
              <div className="w-full max-w-md aspect-square flex items-center justify-center">
                <i className="fa fa-cube text-8xl text-slate-200/80"></i>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 轮播指示器 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-blue-600' : 'bg-slate-300 hover:bg-slate-400'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`切换到第 ${index + 1} 张幻灯片`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
