import React from 'react';
import ModelCard from '../components/Degradationcard';
import degradationItems from '../data/degradationItems';
import Degradationcard from '../components/Degradationcard';

const ModelsPage = () => {
  return (
    <div className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-[clamp(2rem,5vw,3rem)] font-bold mb-4">Seed Models</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Our portfolio of advanced AI models representing cutting-edge research and development
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {degradationItems.map((item) => (
            <Degradationcard key={item.id} model={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModelsPage;
