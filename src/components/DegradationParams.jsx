import React from 'react';
import { ParamSlider, ParamSelect, ParamColorPicker, ParamPanel } from './ParamControls';

// 退化类型名称映射
export const degradationNameMap = {
  'blur': '模糊',
  'downsampling': '下采样',
  'noise': '噪声',
  'encoding': '编码压缩',
  'scratch': '划痕',
  'dirtySpot': '脏点',
  '锯齿': '锯齿',
  'interlacing': '隔行',
  'edgeArtifact': '边缘伪影',
  'flicker': '闪烁',
  'jitter': '抖动',
  'motionBlur': '运动模糊'
};

// 退化参数面板渲染器
export const renderParamPanel = (id, params, setParams) => {
  // 根据不同退化类型渲染对应的参数面板
  switch (id) {
    case 'blur':
      return (
        <ParamPanel title="模糊参数">
          <ParamSlider
            label="模糊核大小"
            value={params.kernelSize}
            min={1}
            max={15}
            step={2}
            onChange={(value) => setParams(prev => ({ ...prev, kernelSize: value }))}
            unit="px"
          />
          <ParamSlider
            label="标准差"
            value={params.standardDeviation}
            min={0.1}
            max={3.0}
            step={0.1}
            onChange={(value) => setParams(prev => ({ ...prev, standardDeviation: value }))}
          />
        </ParamPanel>
      );
    
    case 'downsampling':
      return (
        <ParamPanel title="下采样参数">
          <ParamSelect
            label="插值方法"
            value={params.method}
            options={[
              { value: 'nearest', label: '最近邻插值' },
              { value: 'bilinear', label: '双线性插值' },
              { value: 'bicubic', label: '双三次插值' }
            ]}
            onChange={(value) => setParams(prev => ({ ...prev, method: value }))}
          />
          <ParamSlider
            label="缩放比例"
            value={params.scale}
            min={0.1}
            max={1.0}
            step={0.1}
            onChange={(value) => setParams(prev => ({ ...prev, scale: value }))}
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
              { value: 'saltpepper', label: '椒盐噪声' },
              { value: 'poisson', label: '泊松噪声' }
            ]}
            onChange={(value) => setParams(prev => ({ ...prev, type: value }))}
          />
          <ParamSlider
            label="噪声强度"
            value={params.intensity}
            min={0.01}
            max={0.5}
            step={0.01}
            onChange={(value) => setParams(prev => ({ ...prev, intensity: value }))}
          />
          <ParamSlider
            label="噪声密度"
            value={params.density}
            min={0.01}
            max={0.2}
            step={0.01}
            onChange={(value) => setParams(prev => ({ ...prev, density: value }))}
          />
        </ParamPanel>
      );
    
    case 'encoding':
      return (
        <ParamPanel title="编码压缩参数">
          <ParamSelect
            label="压缩方法"
            value={params.method}
            options={[
              { value: 'jpeg', label: 'JPEG压缩' },
              { value: 'h264', label: 'H.264压缩' },
              { value: 'h265', label: 'H.265压缩' }
            ]}
            onChange={(value) => setParams(prev => ({ ...prev, method: value }))}
          />
          <ParamSlider
            label="压缩质量"
            value={params.quality}
            min={10}
            max={100}
            step={5}
            onChange={(value) => setParams(prev => ({ ...prev, quality: value }))}
            unit="%"
          />
          <ParamSlider
            label="码率"
            value={params.bitrate}
            min={500}
            max={5000}
            step={100}
            onChange={(value) => setParams(prev => ({ ...prev, bitrate: value }))}
            unit="kbps"
          />
        </ParamPanel>
      );
    
    case 'scratch':
      return (
        <ParamPanel title="划痕参数">
          <ParamSlider
            label="划痕数量"
            value={params.count}
            min={1}
            max={20}
            step={1}
            onChange={(value) => setParams(prev => ({ ...prev, count: value }))}
          />
          <ParamSlider
            label="线条宽度"
            value={params.width}
            min={1}
            max={5}
            step={0.5}
            onChange={(value) => setParams(prev => ({ ...prev, width: value }))}
            unit="px"
          />
          <ParamSlider
            label="线条亮度"
            value={params.brightness}
            min={0.1}
            max={1.0}
            step={0.1}
            onChange={(value) => setParams(prev => ({ ...prev, brightness: value }))}
          />
        </ParamPanel>
      );
    
    case 'dirtySpot':
      return (
        <ParamPanel title="脏点参数">
          <ParamSlider
            label="脏点数量"
            value={params.count}
            min={1}
            max={30}
            step={1}
            onChange={(value) => setParams(prev => ({ ...prev, count: value }))}
          />
          <ParamSlider
            label="斑点直径"
            value={params.diameter}
            min={2}
            max={30}
            step={1}
            onChange={(value) => setParams(prev => ({ ...prev, diameter: value }))}
            unit="px"
          />
          <ParamColorPicker
            label="斑点颜色"
            value={params.color}
            onChange={(value) => setParams(prev => ({ ...prev, color: value }))}
          />
        </ParamPanel>
      );
    
    case '锯齿':
      return (
        <ParamPanel title="锯齿参数">
          <ParamSlider
            label="缩放比例"
            value={params.scale}
            min={1.1}
            max={3.0}
            step={0.1}
            onChange={(value) => setParams(prev => ({ ...prev, scale: value }))}
          />
          <ParamSlider
            label="锯齿强度"
            value={params.intensity}
            min={0.1}
            max={1.0}
            step={0.1}
            onChange={(value) => setParams(prev => ({ ...prev, intensity: value }))}
          />
        </ParamPanel>
      );
    
    case 'interlacing':
      return (
        <ParamPanel title="隔行参数">
          <ParamSlider
            label="隔行强度"
            value={params.strength}
            min={0.1}
            max={1.0}
            step={0.1}
            onChange={(value) => setParams(prev => ({ ...prev, strength: value }))}
          />
        </ParamPanel>
      );
    
    case 'edgeArtifact':
      return (
        <ParamPanel title="边缘伪影参数">
          <ParamSlider
            label="核大小"
            value={params.kernelSize}
            min={1}
            max={10}
            step={1}
            onChange={(value) => setParams(prev => ({ ...prev, kernelSize: value }))}
            unit="px"
          />
          <ParamSlider
            label="标准差"
            value={params.standardDeviation}
            min={0.1}
            max={2.0}
            step={0.1}
            onChange={(value) => setParams(prev => ({ ...prev, standardDeviation: value }))}
          />
        </ParamPanel>
      );
    
    case 'flicker':
      return (
        <ParamPanel title="闪烁参数">
          <ParamSlider
            label="闪烁频率"
            value={params.frequency}
            min={1}
            max={20}
            step={1}
            onChange={(value) => setParams(prev => ({ ...prev, frequency: value }))}
            unit="帧"
          />
          <ParamSlider
            label="亮度波动幅度"
            value={params.amplitude}
            min={0.1}
            max={0.8}
            step={0.1}
            onChange={(value) => setParams(prev => ({ ...prev, amplitude: value }))}
          />
        </ParamPanel>
      );
    
    case 'jitter':
      return (
        <ParamPanel title="抖动参数">
          <ParamSlider
            label="抖动频率"
            value={params.frequency}
            min={1}
            max={10}
            step={1}
            onChange={(value) => setParams(prev => ({ ...prev, frequency: value }))}
            unit="帧"
          />
          <ParamSlider
            label="位移范围"
            value={params.range}
            min={1}
            max={20}
            step={1}
            onChange={(value) => setParams(prev => ({ ...prev, range: value }))}
            unit="px"
          />
        </ParamPanel>
      );
    
    case 'motionBlur':
      return (
        <ParamPanel title="运动模糊参数">
          <ParamSlider
            label="运动角度"
            value={params.angle}
            min={0}
            max={360}
            step={15}
            onChange={(value) => setParams(prev => ({ ...prev, angle: value }))}
            unit="°"
          />
          <ParamSlider
            label="运动长度"
            value={params.length}
            min={1}
            max={30}
            step={1}
            onChange={(value) => setParams(prev => ({ ...prev, length: value }))}
            unit="px"
          />
        </ParamPanel>
      );
    
    default:
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">该退化类型的参数面板正在开发中</p>
        </div>
      );
  }
};
    