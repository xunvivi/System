import React from 'react';
import ResearchAreaCard from '../components/ResearchAreaCard';
import researchAreas from '../data/researchData';

const ResearchFocusPage = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold mb-4">Research Focus Areas</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our key research directions pushing the boundaries of artificial intelligence
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {researchAreas.map((area) => (
            <ResearchAreaCard key={area.id} area={area} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchFocusPage;
