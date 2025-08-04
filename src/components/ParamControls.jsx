import React, { memo } from 'react';


export const ParamSlider = memo(({ label, value, min, max, step, onChange, unit = '' }) => {
  
  const handleChange = (e) => {
    const newValue = parseFloat(e.target.value);
    onChange(newValue); // 直接同步到父组件
    console.log(`滑块更新: ${label} = ${newValue}`);
  };


  const displayValue = step % 1 === 0 
    ? parseInt(value, 10) 
    : parseFloat(value).toFixed(2);

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}: {displayValue}{unit}
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}  
        onChange={handleChange}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
 
        style={{ 
          padding: '8px 0', 
          margin: '-8px 0',
          position: 'relative',
          zIndex: 10
        }}
      />
    </div>
  );
});


export const ParamSelect = memo(({ label, value, options, onChange }) => {
 
  const handleChange = (e) => {
    console.log(`选择更新: ${label} = ${e.target.value}`);
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <select 
        value={value ?? options[0]?.value}
        onChange={handleChange}
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
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


export const ParamColorPicker = memo(({ label, value, onChange }) => {
  const handleChange = (e) => {
    console.log(`颜色更新: ${label} = ${e.target.value}`);
    onChange(e.target.value);
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || '#000000'}
          onChange={handleChange}
          className="w-10 h-10 p-0 border rounded cursor-pointer transition-transform hover:scale-105"
        />
        <span className="text-sm">{value || '#000000'}</span>
      </div>
    </div>
  );
});


export const ParamPanel = memo(({ title, children }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-semibold text-gray-800 mb-3">{title}</h4>
    {children}
  </div>
));


export const renderParamPanel = (id, currentParams, handleParamsChange) => {
  const params = currentParams || {};

  switch (id) {
    case 'blur':
      return (
        <ParamPanel title="模糊参数">
          <ParamSlider
            label="模糊核大小"
            value={params.kernelSize ?? 5}
            min={1}
            max={15}
            step={2}
            onChange={(value) => handleParamsChange({ ...params, kernelSize: value })}
          />
          <ParamSlider
            label="标准差"
            value={params.standardDeviation ?? 1.0}
            min={0.1}
            max={5.0}
            step={0.1}
            onChange={(value) => handleParamsChange({ ...params, standardDeviation: value })}
          />
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
              { value: 'gaussian', label: '高斯噪声' },
              { value: 'saltAndPepper', label: '椒盐噪声' },
              { value: 'poisson', label: '泊松噪声' }
            ]}
            onChange={(value) => handleParamsChange({ ...params, type: value })}
          />
          <ParamSlider
            label="强度"
            value={params.intensity ?? 0.1}
            min={0.01}
            max={0.5}
            step={0.01}
            onChange={(value) => handleParamsChange({ ...params, intensity: value })}
          />
          {params.type === 'saltAndPepper' && (
            <ParamSlider
              label="密度"
              value={params.density ?? 0.05}
              min={0.01}
              max={0.2}
              step={0.01}
              onChange={(value) => handleParamsChange({ ...params, density: value })}
            />
          )}
        </ParamPanel>
      );

    default:
      return <div>该类型暂无可配置参数</div>;
  }
};
