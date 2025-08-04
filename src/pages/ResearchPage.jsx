import React from 'react';
import researchPublications from '../data/publicationData';

const ResearchPage = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold mb-4">Research Publications</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Discover our latest research findings and publications in top AI conferences
          </p>
        </div>

        <div className="space-y-8">
          {researchPublications.map((pub, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <h3 className="text-xl font-bold mb-2 md:mb-0">{pub.title}</h3>
                <span className="text-sm text-slate-500">{pub.date}</span>
              </div>
              <p className="text-slate-600 mb-4">{pub.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {pub.authors.map((author, i) => (
                  <span key={i} className="text-sm bg-slate-100 px-3 py-1 rounded-full text-slate-700">
                    {author}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">{pub.conference}</span>
                <a href="#" className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium">
                  View Paper <i className="fa fa-external-link ml-1"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchPage;
