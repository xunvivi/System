import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-[rgba(10,17,40,0.9)] border-t border-[rgba(0,229,255,0.2)] py-6 text-[#a0b3d6] text-xs">
      <div className="container mx-auto px-4">
        {/* 上部内容区域 */}
        <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
          {/* Logo 区域 */}
          <div>
            <div className="flex items-center space-x-1.5 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-[var(--accent)] to-teal-500 rounded-md flex items-center justify-center">
                <span className="font-bold text-xs text-white">S</span>
              </div>
              <span className="font-bold text-xs text-white">Logo</span>
            </div>
            <p className="max-w-xs leading-relaxed text-[10px]">
              Advancing the frontiers of artificial intelligence research and development.
            </p>
          </div>
          
          {/* 链接网格 */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-bold mb-2 text-white text-[10px]">Programs</h4>
              <ul className="space-y-1">
                <li>
                  <Link to="/programs" className="hover:text-[var(--accent)] transition-colors duration-300 text-[9px]">
                    Top Seed Talent
                  </Link>
                </li>
                <li>
                  <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300 text-[9px]">
                    Research Internships
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300 text-[9px]">
                    Collaborations
                  </a>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-2 text-white text-[10px]">Research</h4>
              <ul className="space-y-1">
                <li>
                  <Link to="/models" className="hover:text-[var(--accent)] transition-colors duration-300 text-[9px]">
                    Models
                  </Link>
                </li>
                <li>
                  <Link to="/research" className="hover:text-[var(--accent)] transition-colors duration-300 text-[9px]">
                    Publications
                  </Link>
                </li>
                <li>
                  <Link to="/focus" className="hover:text-[var(--accent)] transition-colors duration-300 text-[9px]">
                    Research Areas
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-2 text-white text-[10px]">Company</h4>
              <ul className="space-y-1">
                <li>
                  <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300 text-[9px]">
                    About ByteDance
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300 text-[9px]">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300 text-[9px]">
                    Careers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* 底部版权区域 */}
        <div className="pt-3 border-t border-[rgba(0,229,255,0.1)] flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="text-[9px] opacity-80">
            © {new Date().getFullYear()} Logo. All rights reserved.
          </p>
          <div className="flex space-x-3">
            <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300 text-xs">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300 text-xs">
              <i className="fa fa-linkedin"></i>
            </a>
            <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300 text-xs">
              <i className="fa fa-github"></i>
            </a>
            <a href="#" className="hover:text-[var(--accent)] transition-colors duration-300 text-xs">
              <i className="fa fa-youtube-play"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
