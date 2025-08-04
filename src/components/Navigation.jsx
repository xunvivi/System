import { Navbar, Nav, Container } from "react-bootstrap";
import logo from '../assets/img/logo.svg';
import navIcon1 from '../assets/img/nav-icon1.svg';
import navIcon2 from '../assets/img/nav-icon2.svg';
import navIcon3 from '../assets/img/nav-icon3.svg';
import { HashLink } from 'react-router-hash-link';
import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation
} from 'react-router-dom';

//导航栏

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // 监听滚动事件以更改导航栏样式
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 导航链接数据
  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/single', label: 'Single' },
    { path: '/compound', label: 'compound' },
    { path: '/research', label: 'Research' }
  ];

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-xl text-white">S</span>
          </div>
          <span className="font-bold text-xl">Logo</span>
        </Link>
        
        {/* 桌面导航 */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              to={link.path}
              className={`transition-colors ${
                location.pathname === link.path 
                  ? 'text-blue-600 font-medium' 
                  : 'text-slate-700 hover:text-blue-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        
        {/* 移动端菜单按钮 */}
        <button 
          className="md:hidden text-xl"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <i className="fa fa-times"></i>
          ) : (
            <i className="fa fa-bars"></i>
          )}
        </button>
      </div>
      
      {/* 移动端导航菜单 */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t py-4 px-4 shadow-lg">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                className={`transition-colors py-2 ${
                  location.pathname === link.path 
                    ? 'text-blue-600 font-medium' 
                    : 'text-slate-700 hover:text-blue-600'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};


