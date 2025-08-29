import React from 'react';
import { Link } from 'react-router-dom';
import BannerCarousel from '../components/Banner';
import degradationItems from '../data/degradationItems';
import Degradationcard from '../components/Degradationcard';

// 首页
const HomePage = () => {
  return (
    <div>
      {/* 英雄区域 - 移除scale，直接调整内边距 */}
      <section className="hero" style={{ padding: '5px 0 15px 0' }}>
        <BannerCarousel /> {/* 直接使用轮播，不缩放 */}
      </section>

      {/* 单问题预览部分 - 移除scale，通过调整内部样式缩小 */}
<section className="features-section" style={{ padding: '0px 0' }}>
  <div className="container">
    {/* 标题区域 */}
    <div className="section-header" style={{ 
      marginBottom: '16px', 
      marginTop: '12px', 
      textAlign: 'center'  // 容器整体居中对齐
    }}>
      <h2 style={{ 
        fontSize: '1.1rem', 
        margin: '0 0 8px 0',
        textAlign: 'center'  // 标题单独居中
      }}>单个降质问题模拟展示</h2>
      
      <div style={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
        margin: '0 auto 12px',  // 水平线居中，上下间距调整
        width: '60%'  // 控制水平线宽度，增强居中视觉效果
      }}></div>
      
      <p style={{ 
        fontSize: '0.8rem', 
        textAlign: 'center',  // 文本居中对齐
        margin: '0 auto',     // 水平居中
        lineHeight: '1.4',
        maxWidth: '80%'       // 限制最大宽度，避免过长行
      }}>
        该部分展示了单个降质问题的模拟过程，包括问题描述、问题分析、问题解决方案等内容。
      </p>
    </div>
    
    {/* 网格内容区域 */}
    <div className="features-grid-items" style={{ 
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: '8px' // 缩小间距
    }}>
      {degradationItems.map((item) => (
        <Link 
          key={item.id}
          to={`/simulation/${item.id}`} 
          style={{ 
            textDecoration: 'none', 
            display: 'block' 
          }}
        >
          <div className="feature-card" style={{ 
            padding: '8px', // 缩小内边距
            minHeight: 'auto',
            cursor: 'pointer',
            transition: 'transform 0.3s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div className="feature-header" style={{ 
  display: 'flex',
  alignItems: 'center',    // 明确垂直居中
  justifyContent: 'flex-start', // 明确水平起始对齐
  gap: '5px',
  marginBottom: '0'
}}>
  <div className="feature-icon" style={{ 
    width: '24px',
    height: '24px',
    fontSize: '12px',
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }}>
    <i className={`fas ${item.icon}`}></i>
  </div>
  <h3 className="feature-title" style={{ 
    fontSize: '0.75rem',
    margin: 0,
    lineHeight: '1.2',
    textAlign: 'left',       // 明确文本左对齐
    whiteSpace: 'nowrap',    // 防止换行
    overflow: 'hidden',      // 处理过长文本
    textOverflow: 'ellipsis' // 显示省略号
  }}>
    {item.name}
    <span style={{ 
      fontSize: '0.6rem', 
      color: 'var(--accent)',
      marginLeft: '3px',
      opacity: 0.8
    }}>
      ({item.id})
    </span>
  </h3>
</div>
          </div>
        </Link>
      ))}
    </div>
  </div>
</section>

      {/* 复合降质部分 - 移除scale，通过调整内部样式缩小 */}
      <section className="features-section" style={{ padding: '12px 0' }}>
        <div className="container">
    {/* 标题区域 */}
    <div className="section-header" style={{ 
      marginBottom: '16px', 
      marginTop: '12px', 
      textAlign: 'center'  // 容器整体居中对齐
    }}>
      <h2 style={{ 
        fontSize: '1.1rem', 
        margin: '0 0 8px 0',
        textAlign: 'center'  // 标题单独居中
      }}>（2+[1]）高阶退化过程模拟</h2>
      
      <div style={{ 
        borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
        margin: '0 auto 12px',  // 水平线居中，上下间距调整
        width: '60%'  // 控制水平线宽度，增强居中视觉效果
      }}></div>
      
      <p style={{ 
        fontSize: '0.8rem', 
        textAlign: 'center',  // 文本居中对齐
        margin: '0 auto',     // 水平居中
        lineHeight: '1.4',
        maxWidth: '80%'       // 限制最大宽度，避免过长行
      }}>
        按照(2+[1])高阶退化模型，模拟广电老旧视频的退化过程。
      </p>
    </div>
         
          <div className="features-grid">
            <div className="feature-card" style={{ padding: '12px' }}>
              <div className="feature-content">
                <div className="features-flex-container" style={{ 
                  display: 'flex',
                  alignItems: 'stretch',
                  justifyContent: 'center',
                  gap: '6px', // 缩小间距
                  background: 'rgba(0,0,0,0.2)', 
                  padding: '10px', // 缩小内边距
                  borderRadius: '8px', 
                  margin: '10px 0',
                  flexWrap: 'wrap'
                }}>
                  {/* 第一阶段（调整内部样式缩小） */}
                  <div style={{ 
                    flex: 1, 
                    minWidth: '160px', // 缩小最小宽度
                    padding: '6px', // 缩小内边距
                    background: 'rgba(10, 17, 40, 0.4)',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 229, 255, 0.15)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '5px',
                      marginBottom: '2px' 
                    }}>
                      <i className="fas fa-play-circle" style={{ 
                        color: 'var(--accent)', 
                        fontSize: '0.7rem' // 缩小图标
                      }}></i>
                      <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>第一阶基础退化层
                    <span style={{
                           background: 'rgba(0, 229, 255, 0.1)',
                           color: 'var(--accent)',
                           padding: '1px 5px',
                           borderRadius: '12px',
                           fontSize: '0.6rem',
                           display: 'inline-block'
                    }}>
                      必选
                    </span>
                    </span>
                    </div>
                    <ul style={{
  color: '#a0b3d6',
  fontSize: '0.6rem',
  margin: '3px 0 0 0',
  paddingLeft: '16px', // 缩进让它和“第”字对齐
  listStylePosition: 'inside',
  lineHeight: '1.2',
  textAlign: 'left'
}}>
  <li>模糊</li>
  <li>下采样</li>
  <li>噪声</li>
  <li>编码压缩</li>
</ul>
                  </div>
                  
                  {/* 阶段箭头（缩小） */}
                  <div className="model-arrow" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: 'var(--accent)',
                    opacity: 0.7,
                    fontSize: '0.7rem',
                    padding: '0 3px'
                  }}>
                    <i className="fas fa-long-arrow-alt-right"></i>
                  </div>
                  
                  {/* 第二阶段（同上，按比例缩小） */}
                  <div style={{ 
                    flex: 1, 
                    minWidth: '160px',
                    padding: '6px',
                    background: 'rgba(10, 17, 40, 0.4)',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 229, 255, 0.15)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '5px',
                      marginBottom: '2px'
                    }}>
                      <i className="fas fa-play-circle" style={{ 
                        color: 'var(--accent)', 
                        fontSize: '0.7rem'
                      }}></i>
                    <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>第二阶基础退化层
                    <span style={{
                           background: 'rgba(0, 229, 255, 0.1)',
                           color: 'var(--accent)',
                           padding: '1px 5px',
                           borderRadius: '12px',
                           fontSize: '0.6rem',
                           display: 'inline-block'
                    }}>
                      必选
                    </span>
                    </span>
                    </div>
                    <ul style={{
  color: '#a0b3d6',
  fontSize: '0.6rem',
  margin: '3px 0 0 0',
  paddingLeft: '16px', // 缩进让它和“第”字对齐
  listStylePosition: 'inside',
  lineHeight: '1.2',
  textAlign: 'left'
}}>
  <li>模糊</li>
  <li>下采样</li>
  <li>噪声</li>
  <li>编码压缩</li>
</ul>


                  </div>
                  
                  {/* 阶段箭头（缩小） */}
                  <div className="model-arrow" style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: 'var(--accent2)',
                    opacity: 0.7,
                    fontSize: '0.7rem',
                    padding: '0 3px'
                  }}>
                    <i className="fas fa-long-arrow-alt-right"></i>
                  </div>
                  
                  {/* 第三阶段（同上，按比例缩小） */}
                  <div style={{ 
                    flex: 1, 
                    minWidth: '160px',
                    padding: '6px',
                    background: 'rgba(10, 17, 40, 0.4)',
                    borderRadius: '6px',
                    border: '1px solid rgba(255, 42, 109, 0.2)'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '5px',
                      marginBottom: '2px'
                    }}>
                      <i className="fas fa-play-circle" style={{ 
                        color: 'var(--accent2)', 
                        fontSize: '0.7rem'
                      }}></i>
                      <span style={{ fontSize: '0.7rem', fontWeight: '500' }}>第三阶强化退化层
                    <span style={{
                           background: 'rgba(255, 42, 109, 0.1)',
                           color: 'var(--accent2)',
                           padding: '1px 5px',
                           borderRadius: '12px',
                           fontSize: '0.6rem',
                           display: 'inline-block'
                    }}>
                      可选
                    </span>
                    </span>
                    </div>
                    <p style={{ 
                      color: '#a0b3d6', 
                      fontSize: '0.6rem', 
                      margin: 0,
                      lineHeight: '1.2'
                    }}>
                      特定场景退化：划痕、脏点、闪烁等
                    </p>
                  </div>
                </div>
                
                <div style={{ 
                  textAlign: 'center',
                  margin: '12px 0'
                }}>
                  <p style={{ 
                    fontSize: '0.75rem', 
                    textAlign: 'left', 
                    margin: '0 auto',
                    lineHeight: '1.4',
                    maxWidth: '90%',
                    textIndent: '2em'
                  }}>
                    自定义每个退化阶段的退化参数，模拟不同历史时期和环境条件下的视频退化效果，生成符合广电老旧视频降质特征的低质量样本。
                  </p>
                </div>
                
                {/* 按钮（缩小） */}
                <div style={{ textAlign: 'center', marginTop: '8px' }}>
                  <a href="/compound" className="btn" style={{ 
                    padding: '5px 12px',
                    fontSize: '0.7rem'
                  }}>
                    开始高阶退化模拟 <i className="fas fa-cogs ml-2" style={{ fontSize: '0.6rem' }}></i>
                  </a>
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
    