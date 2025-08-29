import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ParamSlider, ParamSelect } from './ParamControls';

const ParamControlPanel = ({
  degradationType,
  params,
  onParamChange,
  onResetParams,
  isDisabled
}) => {
  const [currentNoiseType, setCurrentNoiseType] = useState('高斯噪声');

  useEffect(() => {
    if (degradationType?.id === 'noise') {
      setCurrentNoiseType(params.noise_type || '高斯噪声');
    } else {
      setCurrentNoiseType('高斯噪声');
    }
  }, [degradationType?.id, params.noise_type]);

  if (!degradationType) {
    return (
      <div className="text-center py-4 text-gray-500 text-[9px]">
        <p>无效的退化类型，无法加载参数</p>
      </div>
    );
  }

  const paramDefinitions = degradationType.params || {};
  const isNoiseType = degradationType.id === 'noise';

  const noiseIntensityConfig = {
    '高斯噪声': {
      label: '标准差（σ）',
      description: '控制高斯噪声的分布范围',
      max: 30.0,
      unit: ''
    },
    '泊松噪声': {
      label: '缩放因子',
      description: '控制泊松噪声的强度',
      max: 30.0,
      unit: ''
    },
    '椒盐噪声': {
      label: '噪声占比',
      description: '被污染像素的百分比',
      max: 20.0,
      unit: '%'
    }
  };

  const getCurrentIntensityConfig = () => {
    return noiseIntensityConfig[currentNoiseType] || noiseIntensityConfig['高斯噪声'];
  };

  const handleNoiseTypeChange = (value) => {
    onParamChange('type', value);
    setCurrentNoiseType(value);
  };

  return (
    <div className="param-control-panel text-[9px]">
      <div className="section-title flex justify-between items-center mb-2">
        <div className="flex items-center">
          <i className="fas fa-sliders-h text-[8px] mr-0.5"></i>
          <span>参数调节</span>
        </div>
        <button
          onClick={onResetParams}
          disabled={isDisabled}
          className={`text-gray-500 hover:text-gray-700 flex items-center text-[8px] transition-colors ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <RefreshCw className="w-2 h-2 mr-0.5" />
          重置
        </button>
      </div>

      {/* 增加了明确的布局和间距 */}
      <div className="param-controls-container space-y-3">
        {Object.entries(paramDefinitions).map(([key, param]) => {
          // 为每个参数项添加容器，确保间距（已移除边框）
          const ParamItemWrapper = ({ children }) => (
            <div className="param-item p-1.5 bg-black/10 rounded-md">
              {children}
            </div>
          );

          if (isNoiseType) {
            if (key === 'type') {
              return (
                <ParamItemWrapper key={key}>
                  <ParamSelect
                    label={param.description || '噪声类型'}
                    value={currentNoiseType}
                    options={param.options.map(option => ({
                      value: option,
                      label: option
                    }))}
                    onChange={handleNoiseTypeChange}
                    disabled={isDisabled}
                    size="xs"
                    className="py-0 text-[8px] h-5"
                  />
                </ParamItemWrapper>
              );
            }

            if (key === 'intensity') {
              const config = getCurrentIntensityConfig();
              return (
                <ParamItemWrapper key={key}>
                  <ParamSlider
                    key={key}
                    label={config.label}
                    value={params[key] || param.default}
                    min={param.min}
                    max={config.max}
                    step={param.type === 'float' ? 0.1 : 1}
                    unit={config.unit}
                    description={config.description}
                    onChange={(value) => onParamChange(key, value)}
                    disabled={isDisabled}
                    size="xs"
                    className="py-0 text-[8px] h-5"
                  />
                </ParamItemWrapper>
              );
            }

            if (key === 'saltPepperRatio' && currentNoiseType === '椒盐噪声') {
              return (
                <ParamItemWrapper key={key}>
                  <ParamSlider
                    key={key}
                    label="盐/椒比例"
                    value={params[key] || param.default}
                    min={param.min}
                    max={param.max}
                    step={param.type === 'float' ? 0.1 : 1}
                    description="白色噪声占总噪声的比例"
                    onChange={(value) => onParamChange(key, value)}
                    disabled={isDisabled}
                    size="xs"
                    className="py-0 text-[8px] h-5"
                  />
                </ParamItemWrapper>
              );
            }
          }

          // 非噪声类型参数渲染
          if (param.type === 'select') {
            return (
              <ParamItemWrapper key={key}>
                <ParamSelect
                  label={param.description}
                  value={params[key] || param.default}
                  options={param.options.map(option => ({
                    value: option,
                    label: option === 'nearest' ? '最近邻' :
                           option === 'linear' ? '线性' :
                           option === 'cubic' ? '三次方' : option
                  }))}
                  onChange={(value) => onParamChange(key, value)}
                  disabled={isDisabled}
                  size="xs"
                  className="py-0 text-[8px] h-5"
                />
              </ParamItemWrapper>
            );
          } else {
            return (
              <ParamItemWrapper key={key}>
                <ParamSlider
                  key={key}
                  label={param.description}
                  value={params[key] || param.default}
                  min={param.min}
                  max={param.max}
                  step={param.type === 'float' ? 0.1 : 1}
                  onChange={(value) => onParamChange(key, value)}
                  disabled={isDisabled}
                  size="xs"
                  className="py-0 text-[8px] h-5"
                />
              </ParamItemWrapper>
            );
          }
        })}
      </div>

      <style jsx>{`
        .param-controls-container {
          /* 确保容器有足够空间 */
          width: 100%;
          box-sizing: border-box;
        }
        
        .param-item {
          /* 每个参数项之间的间距和样式 - 已移除边框 */
          transition: all 0.2s ease;
        }
        
        .param-item:hover {
          /* 移除边框后，可以保留悬停效果但不显示边框 */
          background-color: rgba(0, 229, 255, 0.05);
        }
      `}</style>
    </div>
  );
};

export default ParamControlPanel;

