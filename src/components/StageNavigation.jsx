import React from 'react';
import { Check } from 'lucide-react';
import { STAGES } from '../pages/CompoundPage';

const StageNavigation = ({ activeStage, setActiveStage, isProcessing, progress }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STAGES.map((stage, index) => {
          const isActive = activeStage === stage.id;
          const isCompleted = progress > (index + 1) * 33 && isProcessing;
          
          return (
            <React.Fragment key={stage.id}>
              <button
                onClick={() => !isProcessing && setActiveStage(stage.id)}
                disabled={isProcessing}
                style={{ outline: 'none', border: 'none' }}
                className={`flex flex-col items-center outline-none focus:outline-none border-0 focus:border-0 active:outline-none hover:outline-none rounded-lg p-2 transition-all duration-200 ${
                  isActive 
                    ? 'text-blue-600' 
                    : isCompleted 
                      ? 'text-green-600' 
                      : 'text-gray-500'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors duration-200 ${
                  isActive 
                    ? 'bg-blue-100' 
                    : isCompleted 
                      ? 'bg-green-100' 
                      : 'bg-gray-100'
                }`}>
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <span className="text-xs font-medium text-center">{stage.title.split('（')[0]}</span>
                {stage.required && (
                  <span className="text-xs text-red-500">必选</span>
                )}
              </button>
              
              {/* 连接线 */}
              {index < STAGES.length - 1 && (
                <div className={`flex-1 h-1 mx-2 ${
                  activeStage === STAGES[index + 1].id || isCompleted
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default StageNavigation;