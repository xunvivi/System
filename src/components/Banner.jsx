import { useState, useEffect } from "react";
// 若使用 react-bootstrap 的 Container、Row、Col，需确保已正确安装并引入相关样式
import { Container, Row, Col } from "react-bootstrap"; 
import headerImg from "../assets/img/header-img.svg";
import { ArrowRightCircle } from 'react-bootstrap-icons';
import 'animate.css';
import TrackVisibility from 'react-on-screen';

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      tag: 'Degradation Model Visualization and Display System',
      title: '退化模型可视化系统',
      description: '支持12个独立的单降质问题处理以及复合的三阶段降质问题处理',
      buttonText: '立即开始',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      tag: 'Degradation Model Visualization and Display System',
      title: '退化模型可视化系统',
      description: '支持12个独立的单降质问题处理以及复合的三阶段降质问题处理',
      buttonText: '立即开始',
      buttonColor: 'bg-slate-800 hover:bg-slate-900'
    },
    {
      tag: 'Degradation Model Visualization and Display System',
      title: '退化模型可视化系统',
      description: '支持12个独立的单降质问题处理以及复合的三阶段降质问题处理',
      buttonText: '立即开始',
      buttonColor: 'bg-slate-800 hover:bg-slate-900'
    },
    {
      tag: 'Degradation Model Visualization and Display System',
      title: '退化模型可视化系统',
      description: '支持12个独立的单降质问题处理以及复合的三阶段降质问题处理',
      buttonText: '立即开始',
      buttonColor: 'bg-slate-800 hover:bg-slate-900'
    }
  ];

  // 自动轮播逻辑
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
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
        >
          <div className="h-full flex flex-col md:flex-row">
            {/* 左侧文案区域 */}
            <div className="w-full md:w-1/2 p-12 md:p-16 flex flex-col justify-center">
              <span className="text-blue-600 font-semibold mb-4">{slide.tag}</span>
              <h2 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight mb-6">
                {slide.title}
              </h2>
              <p className="text-slate-600 text-lg max-w-xl mb-8">
                {slide.description}
              </p>
              <button 
                className={`${slide.buttonColor} text-white px-8 py-3 rounded-lg font-medium transition-opacity w-fit`}
              >
                {slide.buttonText}
              </button>
            </div>
            {/* 右侧图片/占位区域 */}
            <div className="w-full md:w-1/2 bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center p-8">
              <div className="w-full max-w-md aspect-square bg-white rounded-xl shadow-lg flex items-center justify-center">
                {/* 这里可以根据实际替换成真实图片，比如用 headerImg  */}
                {/* <img src={headerImg} alt="banner-img" className="w-full h-full object-cover" /> */}
                <i className="fa fa-brain text-7xl text-blue-600/20"></i>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 轮播指示器 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-blue-600' : 'bg-slate-300 hover:bg-slate-400'
            }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;