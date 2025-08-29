import React, { memo } from 'react';

// 确保ParamSlider组件正确接收并显示label属性
export const ParamSlider = memo(({ 
  label, 
  value, 
  min, 
  max, 
  step, 
  onChange, 
  unit = '',
  disabled = false,
  description = '',
  size = 'xs',
  className = ''
}) => {
  const handleChange = (e) => {
    if (disabled) return;
    onChange(parseFloat(e.target.value));
  };

  const displayValue = step % 1 === 0 
    ? parseInt(value, 10) 
    : parseFloat(value).toFixed(2);

  return (
    <div className={`mb-2 ${className}`}>
      {/* 关键：确保label正确显示 */}
      <label className={`block text-sm font-medium mb-1 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
        {label} {/* 这里会显示动态传递的标签 */}
      </label>
      {description && (
        <p className="text-xs text-gray-500 mb-1">{description}</p>
      )}
      <div className="flex items-center gap-2">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}  
          onChange={handleChange}
          disabled={disabled}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-sm text-gray-600 min-w-[40px] text-right">
          {displayValue}{unit}
        </span>
      </div>
    </div>
  );
});


// 下拉选择组件：用于选项类参数
export const ParamSelect = memo(({ 
  label, 
  value, 
  options, 
  onChange,
  disabled = false
}) => {
  const handleChange = (e) => {
    if (disabled) return;
    onChange(e.target.value);
  };

  // 确保默认值有效
  const defaultValue = value ?? options[0]?.value;

  return (
    <div className="mb-5">
      <label className={`block text-sm font-medium mb-2 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
        {label}
      </label>
      <select 
        value={defaultValue}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 transition-all ${
          disabled 
            ? 'bg-gray-100 border-gray-300 cursor-not-allowed' 
            : 'border-gray-300 focus:ring-blue-500'
        }`}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
});

// 颜色选择器组件
export const ParamColorPicker = memo(({ 
  label, 
  value, 
  onChange,
  disabled = false
}) => {
  const handleChange = (e) => {
    if (disabled) return;
    onChange(e.target.value);
  };

  return (
    <div className="mb-5">
      <label className={`block text-sm font-medium mb-2 ${disabled ? 'text-gray-400' : 'text-gray-700'}`}>
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || '#000000'}
          onChange={handleChange}
          disabled={disabled}
          className={`w-10 h-10 p-0 border rounded transition-transform ${
            disabled 
              ? 'border-gray-300 opacity-50 cursor-not-allowed' 
              : 'cursor-pointer hover:scale-105'
          }`}
        />
        <span className={`text-sm ${disabled ? 'text-gray-400' : ''}`}>
          {value || '#000000'}
        </span>
      </div>
    </div>
  );
});

// 参数面板容器
export const ParamPanel = memo(({ title, children }) => (
  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
    <h4 className="font-semibold text-gray-800 mb-4">{title}</h4>
    {children}
  </div>
));

// 根据退化类型渲染对应的参数面板
export const renderParamPanel = (id, currentParams, handleParamsChange) => {
  const params = currentParams || {};

  switch (id) {
    case 'blur':
      return (
        <ParamPanel title="模糊参数">
          <ParamSelect 
            label="模糊类型" 
            options={[
              { value: 'Gaussian', label: '高斯模糊' },
              { value: 'Mean', label: '均值模糊' }
            ]}
            value={params.type}
            onChange={(value) => handleParamsChange({ ...params, type: value })}
          />
          <ParamSlider
            label="模糊核大小"
            value={params.kernelSize ?? 5}
            min={1}
            max={15}
            step={2}
            description="模糊范围（奇数），值越大模糊越强"
            onChange={(value) => handleParamsChange({ ...params, kernelSize: value })}
          />
          {/* 仅高斯模糊显示标准差 */}
          {params.type === 'Gaussian' && (
            <ParamSlider
              label="标准差"
              value={params.standardDeviation ?? 1.0}
              min={0.1}
              max={5.0}
              step={0.1}
              description="控制模糊柔和度，值越大过渡越自然"
              onChange={(value) => handleParamsChange({ ...params, standardDeviation: value })}
            />
          )}
        </ParamPanel>
      );
    
    case 'downsampling':
      return (
        <ParamPanel title="下采样参数">
          <ParamSelect
            label="采样方法"
            value={params.method}
            options={[
              { value: 'bilinear', label: '双线性插值' },
              { value: 'nearest', label: '最近邻' },
              { value: 'bicubic', label: '双三次插值' }
            ]}
            onChange={(value) => handleParamsChange({ ...params, method: value })}
          />
          <ParamSlider
            label="缩放比例"
            value={params.scale ?? 0.5}
            min={0.1}
            max={1.0}
            step={0.1}
            description="下采样后的尺寸比例（0.1=10%原始大小）"
            onChange={(value) => handleParamsChange({ ...params, scale: value })}
          />
        </ParamPanel>
      );
    
    case 'noise':
      return (
        <ParamPanel title="噪声参数">
          <ParamSelect
            label="噪声类型"
            value={params.type}
            options={[
              { value: '高斯噪声', label: '高斯噪声' },
              { value: '泊松噪声', label: '泊松噪声' },
              { value: '椒盐噪声', label: '椒盐噪声' }
            ]}
            onChange={(value) => {
              // 切换噪声类型时重置默认参数
              const newParams = { ...params, type: value };
              if (value === 'gaussian') {
                newParams.intensity = newParams.intensity ?? 5.0;
              } else if (value === 'salt_pepper') {
                newParams.intensity = newParams.intensity ?? 5.0;
                newParams.saltPepperRatio = newParams.saltPepperRatio ?? 0.5;
              } else if (value === 'poisson') {
                newParams.intensity = newParams.intensity ?? 5.0;
              }
              handleParamsChange(newParams);
            }}
          />

          {/* 动态噪声参数：根据类型显示不同标签 */}
          <ParamSlider
            label={
              params.type === '高斯噪声' ? '标准差（σ）' : 
              params.type === '泊松噪声' ? '缩放因子' : 
              '噪声占比'
            }
            value={params.intensity ?? 5.0}
            min={0.01}
            max={params.type === '椒盐噪声' ? 20.0 : 30.0}
            step={0.1}
            unit={params.type === '椒盐噪声' ? '%' : ''}
            description={
              params.type === '高斯噪声' ? '噪声强度，值越大颗粒感越强' :
              params.type === '泊松噪声' ? '亮度关联噪声强度，值越大越明显' :
              '被污染像素比例，值越大噪声越密集'
            }
            onChange={(value) => handleParamsChange({ ...params, intensity: value })}
          />

          {/* 椒盐噪声特有：盐/椒比例 */}
          {params.type === 'salt_pepper' && (
            <ParamSlider
              label="盐/椒比例"
              value={params.saltPepperRatio ?? 0.5}
              min={0.1}
              max={0.9}
              step={0.1}
              description="白色噪声占总噪声的比例（0.5=各占一半）"
              onChange={(value) => handleParamsChange({ ...params, saltPepperRatio: value })}
            />
          )}
        </ParamPanel>
      );

    default:
      return <div className="text-gray-500 text-sm">该类型暂无可配置参数</div>;
  }
};