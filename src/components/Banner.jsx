import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { FaFilm, FaPlayCircle, FaSitemap } from 'react-icons/fa';

const HeroSection = () => {
  useEffect(() => {
    // 按钮悬停动画效果（进一步缩小幅度）
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
      const handleMouseEnter = () => {
        btn.style.transform = 'translateY(-2px)'; // 进一步缩小悬浮位移
        btn.style.boxShadow = '0 5px 15px rgba(0, 229, 255, 0.5)'; // 进一步缩小阴影范围
      };
      
      const handleMouseLeave = () => {
        btn.style.transform = 'translateY(0)';
        btn.style.boxShadow = '0 2px 10px rgba(0, 229, 255, 0.3)'; // 进一步缩小阴影范围
      };
      
      btn.addEventListener('mouseenter', handleMouseEnter);
      btn.addEventListener('mouseleave', handleMouseLeave);
      
      // 清理函数
      return () => {
        btn.removeEventListener('mouseenter', handleMouseEnter);
        btn.removeEventListener('mouseleave', handleMouseLeave);
      };
    });
  }, []);

  return (
    <section className="hero py-4"> {/* 进一步减少垂直内边距 */}
      
      <Container>
        <div className="text-center max-w-2xl mx-auto"> {/* 进一步缩小最大宽度 */}
          <h1 className="font-orbitron text-[clamp(1.4rem,3vw,2.2rem)] font-bold mb-3 leading-tight bg-gradient-to-r from-[#00e5ff] to-white bg-clip-text text-transparent uppercase">
            广电老旧视频退化模型<br/>可视化展示系统
          </h1>
          
          <p className="text-[clamp(0.8rem,1.2vw,1rem)] text-[#a0b3d6] mb-4 leading-relaxed">
            基于对广电老旧视频降质原因和退化过程的系统分析，提出广电老旧视频退化模型，称为（2+[1]）高阶退化模型，模拟广电老旧视频在长期使用和存储过程中产生的各种降质问题。
          </p>
        
        </div>
      </Container>
    </section>
  );
};

export default HeroSection;
