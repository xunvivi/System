import React from 'react';
import { RefreshCw } from 'lucide-react';

const ProcessingControls = ({ 
  isProcessing, 
  isComplete, 
  progress, 
  processingStage, 
  onProcess 
}) => {
  return (
    <>
      <div className="flex justify-center mb-8">
        <button
          onClick={onProcess}
          disabled={isProcessing || isComplete}
          className={`px-8 py-3 rounded-md font-medium transition-colors ${
            isProcessing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-5 w-5 mr-2 inline animate-spin" />
              处理中：{processingStage} ({Math.round(progress)}%)
            </>
          ) : (
            <>开始三阶段退化处理</>
          )}
        </button>
      </div>

      {/* 处理进度条 */}
      {isProcessing && (
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="mb-2 flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">处理进度</span>
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-500">当前阶段：{processingStage}</p>
        </div>
      )}
    </>
  );
};

export default ProcessingControls;