import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import degradationItems from '../data/degradationItems';

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  // 监听滚动，切换导航栏背景
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          navRef.current && !navRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 导航链接数据
  const navLinks = [
    { path: '/', label: '首页' },
    { path: '/single', label: '单个降质问题', hasDropdown: true },
    { path: '/compound', label: '高阶退化过程' }
  ];

  // 切换下拉菜单
  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
      {/* 导航栏容器 - 确保最高层级 */}
      <div 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-9999 transition-all duration-300 ${
          isScrolled ? 'bg-dark/90 backdrop-blur-md py-1' : 'bg-transparent py-2'
        }`}
        style={{ 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          boxSizing: 'border-box',
          height: isScrolled ? '55px' : '60px',
          // 确保导航栏不被遮挡
          pointerEvents: 'auto',
          transform: 'translateZ(0)' // 触发GPU加速，修复层级问题
        }}
      >
        <div className="container mx-auto px-4 h-full">
          <div className="flex items-center justify-between h-full">
            {/* 左侧Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <i className="fas fa-film text-white text-xs"></i>
              </div>
              <span className="text-white font-bold text-sm">广电老旧视频退化模型可视化展示系统</span>
            </Link>

            {/* 桌面端导航 */}
            <div className="hidden md:flex items-center gap-5">
              {navLinks.map((link) => (
                <div key={link.path} className="relative">
                  {link.hasDropdown ? (
                    // 下拉菜单项
                    <div ref={dropdownRef} style={{ position: 'relative' }}>
                      <button
                        onClick={toggleDropdown}
                        className="flex items-center gap-1 text-white hover:text-cyan-400 transition-colors"
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          padding: '2px 0',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          outline: 'none'
                        }}
                      >
                        <span>{link.label}</span>
                        <i className={`fas fa-chevron-down text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
                      </button>

                      {/* 下拉菜单 - 修复版 */}
                      {dropdownOpen && (
                        <div 
                          className="absolute left-0 top-full mt-1 bg-dark border border-gray-800 rounded-lg shadow-lg"
                          style={{
                            width: '250px',
                            maxHeight: '180px',
                            overflowY: 'auto !important', // 强制滚动生效
                            overflowX: 'hidden',
                            zIndex: 9999,
                            backgroundColor: '#1a1a1a',
                            border: '1px solid #374151',
                            top: '100%', // 精确对齐
                            left: 0,
                            margin: 0,
                            padding: 0,
                            // 修复滚动条可见性
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#4B5563 #1F2937'
                          }}
                        >
                          <div className="py-1">
                            {(degradationItems && degradationItems.length > 0 ? degradationItems : [
                              { id: 'D01', name: '模糊降质', icon: 'fa-blur' },
                              { id: 'D02', name: '噪声降质', icon: 'fa-static' },
                              { id: 'D03', name: '压缩降质', icon: 'fa-compress' },
                              { id: 'D04', name: '下采样降质', icon: 'fa-expand-arrows-alt' },
                              { id: 'D05', name: '色彩降质', icon: 'fa-palette' },
                              { id: 'D06', name: '对比度降质', icon: 'fa-adjust' },
                              { id: 'D07', name: '亮度降质', icon: 'fa-sun' },
                              { id: 'D08', name: '饱和度降质', icon: 'fa-tint' },
                              { id: 'D09', name: '锐化降质', icon: 'fa-cut' },
                              { id: 'D10', name: '马赛克降质', icon: 'fa-th' },
                              { id: 'D11', name: '划痕降质', icon: 'fa-slash' },
                              { id: 'D12', name: '闪烁降质', icon: 'fa-bolt' }
                            ]).map((item) => (
                              <Link
                                key={item.id}
                                to={`/simulation/${item.id}`}
                                className="block px-3 py-2 text-white hover:bg-gray-800 hover:text-cyan-400 transition-colors text-sm"
                                onClick={(e) => {
                                  e.stopPropagation(); // 阻止事件冒泡
                                  setDropdownOpen(false);
                                }}
                                style={{ 
                                  textDecoration: 'none',
                                  pointerEvents: 'auto' // 确保可点击
                                }}
                              >
                                <div className="flex items-center gap-2">
                                  <i className={`fas ${item.icon || 'fa-cog'} text-cyan-400 text-xs`}></i>
                                  <span className="flex-1">{item.name}</span>
                                  <span className="text-cyan-400 text-xs opacity-70">({item.id})</span>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // 普通导航项
                    <Link 
                      to={link.path}
                      className={`text-white hover:text-cyan-400 transition-colors inline-block py-2 ${
                        location.pathname === link.path ? 'text-cyan-400 font-medium' : ''
                      }`}
                      style={{ textDecoration: 'none', fontSize: '0.8rem' }}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* 移动端菜单按钮 */}
            <button
              className="md:hidden text-white text-base"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>

        {/* 移动端导航菜单 */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-dark border-t border-gray-800 mt-1" style={{zIndex: 9999}}>
            <div 
              className="container mx-auto px-4 py-2"
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
                overflowX: 'hidden'
              }}
            >
              {/* 移动端内容保持不变 */}
              {navLinks.map((link) => (
                <div key={link.path} className="mb-1">
                  {link.hasDropdown ? (
                    <div>
                      <button
                        onClick={toggleDropdown}
                        className="flex justify-between items-center w-full text-white hover:text-cyan-400 py-2"
                        style={{ background: 'none', border: 'none', textAlign: 'left', fontSize: '0.8rem' }}
                      >
                        <span>{link.label}</span>
                        <i className={`fas fa-chevron-down text-xs transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}></i>
                      </button>
                      {dropdownOpen && (
                        <div 
                          className="pl-4 mt-1 border-l-2 border-cyan-400"
                          style={{
                            maxHeight: '180px',
                            overflowY: 'scroll',
                            overflowX: 'hidden'
                          }}
                        >
                          {(degradationItems && degradationItems.length > 0 ? degradationItems : [
                            { id: 'D01', name: '模糊降质', icon: 'fa-blur' },
                            { id: 'D02', name: '噪声降质', icon: 'fa-static' },
                            { id: 'D03', name: '压缩降质', icon: 'fa-compress' },
                            { id: 'D04', name: '下采样降质', icon: 'fa-expand-arrows-alt' },
                            { id: 'D05', name: '色彩降质', icon: 'fa-palette' },
                            { id: 'D06', name: '对比度降质', icon: 'fa-adjust' },
                            { id: 'D07', name: '亮度降质', icon: 'fa-sun' },
                            { id: 'D08', name: '饱和度降质', icon: 'fa-tint' },
                            { id: 'D09', name: '锐化降质', icon: 'fa-cut' },
                            { id: 'D10', name: '马赛克降质', icon: 'fa-th' },
                            { id: 'D11', name: '划痕降质', icon: 'fa-slash' },
                            { id: 'D12', name: '闪烁降质', icon: 'fa-bolt' }
                          ]).map((item) => (
                            <Link
                              key={item.id}
                              to={`/simulation/${item.id}`}
                              className="block py-3 text-white hover:text-cyan-400 text-sm"
                              onClick={() => {
                                setMobileMenuOpen(false);
                                setDropdownOpen(false);
                              }}
                              style={{ textDecoration: 'none' }}
                            >
                              <div className="flex items-center gap-2">
                                <i className={`fas ${item.icon || 'fa-cog'} text-cyan-400 text-xs`}></i>
                                <span className="flex-1">{item.name}</span>
                                <span className="text-cyan-400 text-xs opacity-70">({item.id})</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={link.path}
                      className={`block py-2 text-white hover:text-cyan-400 text-sm ${
                        location.pathname === link.path ? 'text-cyan-400 font-medium' : ''
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ textDecoration: 'none' }}
                    >
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 顶部占位 */}
      <div style={{ height: '60px' }}></div> 
    </>
  );
};