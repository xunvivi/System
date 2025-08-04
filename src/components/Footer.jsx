import {
  Link
} from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between mb-8">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-500 rounded-lg flex items-center justify-center">
                <span className="font-bold text-xl text-white">S</span>
              </div>
              <span className="font-bold text-xl">Logo</span>
            </div>
            <p className="text-slate-600 max-w-xs">
              Advancing the frontiers of artificial intelligence research and development.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-bold mb-4">Programs</h4>
              <ul className="space-y-2">
                <li><Link to="/programs" className="text-slate-600 hover:text-blue-600 transition-colors">Top Seed Talent</Link></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Research Internships</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Collaborations</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Research</h4>
              <ul className="space-y-2">
                <li><Link to="/models" className="text-slate-600 hover:text-blue-600 transition-colors">Models</Link></li>
                <li><Link to="/research" className="text-slate-600 hover:text-blue-600 transition-colors">Publications</Link></li>
                <li><Link to="/focus" className="text-slate-600 hover:text-blue-600 transition-colors">Research Areas</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">About ByteDance</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-600 hover:text-blue-600 transition-colors">Careers</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Logo. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
              <i className="fa fa-twitter"></i>
            </a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
              <i className="fa fa-linkedin"></i>
            </a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
              <i className="fa fa-github"></i>
            </a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors">
              <i className="fa fa-youtube-play"></i>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
