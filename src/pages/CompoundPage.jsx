import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Play, RotateCcw, Upload, Download, Eye, Sliders, Settings, Layers, Cog, Film, ArrowLeft, ArrowRight, PlusCircle, Info, X, FileImage, FileVideo, AlertCircle } from 'lucide-react';
import { DEGRADATION_CONFIG } from '../data/DEGRADATION_CONFIG';


// API基础路径
const API_BASE_URL = 'http://localhost:8000';

// 根据媒体类型获取支持的压缩格式
const getSupportedCompressionFormats = (mediaType) => {
  const formatMap = {
    image: [
      { value: 'jpeg', label: 'JPEG' },
      { value: 'png', label: 'PNG' },
      { value: 'webp', label: 'WebP' }
    ],
    video: [
      { value: 'h264', label: 'H.264' },
      { value: 'mpeg4', label: 'MPEG-4' }
    ]
  };
  return formatMap[mediaType] || formatMap.image;
};

const VideoDegrade = () => {
  // 状态定义
  const [expandedStages, setExpandedStages] = useState({
    stage1: true,
    stage2: false,
    stage3: false
  });
  
  const [stageEnabled, setStageEnabled] = useState({
    stage1: true,
    stage2: true,
    stage3: false
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState(null);
  const [processedPreviewUrl, setProcessedPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [mediaPath, setMediaPath] = useState('');
  const [mediaType, setMediaType] = useState('');
  const fileInputRef = useRef(null);
  const [uploadAbortController, setUploadAbortController] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  // 参数结构
  const [parameters, setParameters] = useState({
    stage1: {
      blur: {
        kernel_size: DEGRADATION_CONFIG.common.blur.params.kernel_size.default,
        sigma: DEGRADATION_CONFIG.common.blur.params.sigma.default
      },
      resample: {
        scale_factor: DEGRADATION_CONFIG.common.resample.params.scale_factor.default,
        interpolation: DEGRADATION_CONFIG.common.resample.params.interpolation.default
      },
      noise: {
        noise_type: DEGRADATION_CONFIG.common.noise.params.noise_type.default,
        intensity: DEGRADATION_CONFIG.common.noise.params.intensity.default,
        density: DEGRADATION_CONFIG.common.noise.params.density.default
      },
      compression: {
        format: DEGRADATION_CONFIG.common.compression.params.format.default,
        quality: DEGRADATION_CONFIG.common.compression.params.quality.default,
        bitrate: DEGRADATION_CONFIG.common.compression.params.bitrate.default
      }
    },
    stage2: {
      blur: {
        kernel_size: 25,
        sigma: 3.5
      },
      resample: {
        scale_factor: 0.3,
        interpolation: DEGRADATION_CONFIG.common.resample.params.interpolation.default
      },
      noise: {
        noise_type: DEGRADATION_CONFIG.common.noise.params.noise_type.default,
        intensity: 0.2,
        density: 0.1
      },
      compression: {
        format: DEGRADATION_CONFIG.common.compression.params.format.default,
        quality: 15,
        bitrate: 500
      }
    },
    stage3: {
      mediaType: '',
      degradationType: '',
      params: {}
    }
  });

  // 清除错误信息
  const clearError = () => setErrorMessage('');

  // 文件上传处理
  const handleFileSelect = async (file) => {
    if (!file) return;
    clearError();
    
    // 释放可能存在的旧Blob URL，避免内存泄漏
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
      setFilePreviewUrl(null);
    }
    if (processedPreviewUrl) {
      URL.revokeObjectURL(processedPreviewUrl);
      setProcessedPreviewUrl(null);
    }
    
    // 验证文件类型
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const validVideoTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
    
    let type = '';
    if (validImageTypes.includes(file.type)) {
      type = 'image';
    } else if (validVideoTypes.includes(file.type)) {
      type = 'video';
    } else {
      setErrorMessage('请上传有效的图像或视频文件（支持JPG、PNG、GIF、WebP、MP4、MOV等）');
      return;
    }
    
    // 验证文件大小
    if (file.size > 100 * 1024 * 1024) {
      setErrorMessage('文件大小不能超过100MB');
      return;
    }
    
    // 开始上传
    setIsUploading(true);
    setUploadProgress(0);
    setUploadedFile(file);
    setMediaType(type);
    
    // 根据媒体类型自动调整压缩格式
    const defaultFormats = {
      image: DEGRADATION_CONFIG.common.compression.params.format.default,
      video: 'h264'
    };
    
    // 更新两个阶段的压缩格式为当前媒体类型支持的格式
    setParameters(prev => ({
      ...prev,
      stage1: {
        ...prev.stage1,
        compression: {
          ...prev.stage1.compression,
          format: defaultFormats[type]
        }
      },
      stage2: {
        ...prev.stage2,
        compression: {
          ...prev.stage2.compression,
          format: defaultFormats[type]
        }
      }
    }));
    
    // 创建临时预览
    const tempPreviewUrl = URL.createObjectURL(file);
    setFilePreviewUrl(tempPreviewUrl);
    
    try {
      // 模拟上传过程
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadProgress(i);
      }
      
      // 模拟上传成功
      setMediaPath(`/uploads/${file.name}`);
      setIsUploading(false);
      
      // 显示成功提示
      setSuccessMessage('文件上传成功，可以开始处理了');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (error) {
      setErrorMessage(error.message || '文件上传失败，请重试');
      URL.revokeObjectURL(tempPreviewUrl);
      setFilePreviewUrl(null);
      setIsUploading(false);
      setUploadedFile(null);
    }
  };

  // 文件处理相关方法
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFilePreviewUrl(null);
    setProcessedPreviewUrl(null);
    setMediaPath('');
    setMediaType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (filePreviewUrl) {
      URL.revokeObjectURL(filePreviewUrl);
    }
  };

  // 阶段控制方法
  const toggleStage = (stageId) => {
    setExpandedStages(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  const toggleStageEnabled = (stageId) => {
    setStageEnabled(prev => ({
      ...prev,
      [stageId]: !prev[stageId]
    }));
  };

  // 参数更新方法
  const updateStageSubParam = (stage, subType, param, value) => {
    if (subType === 'compression' && param === 'format' && mediaType) {
      const supportedFormats = getSupportedCompressionFormats(mediaType).map(f => f.value);
      if (!supportedFormats.includes(value)) {
        setErrorMessage(`当前媒体类型不支持${value}格式，请选择${mediaType === 'image' ? '图像' : '视频'}格式`);
        return;
      }
    }

    setParameters(prev => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        [subType]: {
          ...prev[stage][subType],
          [param]: value
        }
      }
    }));
  };

  const updateStage3Parameter = (param, value) => {
    setParameters(prev => ({
      ...prev,
      stage3: {
        ...prev.stage3,
        params: {
          ...prev.stage3.params,
          [param]: value
        }
      }
    }));
  };

  const handleStage3MediaTypeChange = (mediaType) => {
    setParameters(prev => ({
      ...prev,
      stage3: {
        ...prev.stage3,
        mediaType,
        degradationType: '',
        params: {}
      }
    }));
  };

  const handleStage3DegradationTypeChange = (degradationType) => {
    const params = {};
    if (parameters.stage3.mediaType && degradationType && DEGRADATION_CONFIG[parameters.stage3.mediaType][degradationType]) {
      Object.entries(DEGRADATION_CONFIG[parameters.stage3.mediaType][degradationType].params).forEach(([key, paramConfig]) => {
        params[key] = paramConfig.default;
      });
    }
    
    setParameters(prev => ({
      ...prev,
      stage3: {
        ...prev.stage3,
        degradationType,
        params
      }
    }));
  };

  // 应用退化处理
  const applyDegradation = async () => {
    if (!uploadedFile || !mediaPath) {
      setErrorMessage('请先上传文件');
      return;
    }

    clearError();
    setIsProcessing(true);
    setProgress(0);
    
    try {
      // 模拟处理过程
      for (let i = 0; i <= 100; i += 5) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setProgress(i);
      }
      
      // 模拟处理成功，使用原图作为处理结果
      setProcessedPreviewUrl(filePreviewUrl);
      
    } catch (error) {
      setErrorMessage(`处理失败: ${error.message}`);
      console.error('处理错误:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // 重置参数
  const resetParameters = () => {
    clearError();
    const defaultFormat = mediaType === 'video' ? 'h264' : DEGRADATION_CONFIG.common.compression.params.format.default;
    
    setParameters({
      stage1: {
        blur: {
          kernel_size: DEGRADATION_CONFIG.common.blur.params.kernel_size.default,
          sigma: DEGRADATION_CONFIG.common.blur.params.sigma.default
        },
        resample: {
          scale_factor: DEGRADATION_CONFIG.common.resample.params.scale_factor.default,
          interpolation: DEGRADATION_CONFIG.common.resample.params.interpolation.default
        },
        noise: {
          noise_type: DEGRADATION_CONFIG.common.noise.params.noise_type.default,
          intensity: DEGRADATION_CONFIG.common.noise.params.intensity.default,
          density: DEGRADATION_CONFIG.common.noise.params.density.default
        },
        compression: {
          format: defaultFormat,
          quality: DEGRADATION_CONFIG.common.compression.params.quality.default,
          bitrate: DEGRADATION_CONFIG.common.compression.params.bitrate.default
        }
      },
      stage2: {
        blur: {
          kernel_size: 25,
          sigma: 3.5
        },
        resample: {
          scale_factor: 0.3,
          interpolation: DEGRADATION_CONFIG.common.resample.params.interpolation.default
        },
        noise: {
          noise_type: DEGRADATION_CONFIG.common.noise.params.noise_type.default,
          intensity: 0.2,
          density: 0.1
        },
        compression: {
          format: defaultFormat,
          quality: 15,
          bitrate: 500
        }
      },
      stage3: {
        mediaType: '',
        degradationType: '',
        params: {}
      }
    });
  };

  // 下载退化结果
  const downloadResult = () => {
    if (!processedPreviewUrl) {
      setErrorMessage('没有可下载的结果文件');
      return;
    }
    const link = document.createElement('a');
    link.href = processedPreviewUrl;
    link.download = `degraded_${uploadedFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 辅助方法
  const getFileIcon = (file) => {
    if (file.type.startsWith('image/')) {
      return <FileImage className="h-5 w-5 text-cyan-400" />;
    } else if (file.type.startsWith('video/')) {
      return <FileVideo className="h-5 w-5 text-cyan-400" />;
    }
    return <Upload className="h-5 w-5 text-cyan-400" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 渲染参数控件
  const renderSubParameterControl = (stage, subType, paramKey, paramConfig) => {
    const value = parameters[stage][subType][paramKey];
    
    if (subType === 'compression' && paramKey === 'format') {
      const supportedFormats = getSupportedCompressionFormats(mediaType || 'image');
      
      return (
        <div className="mb-2" key={paramKey}>
          <label className="block text-xs text-slate-400 mb-1">{paramConfig.description}</label>
          <select 
            className="w-full p-1.5 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:border-cyan-400 transition-colors"
            value={value}
            onChange={(e) => updateStageSubParam(stage, subType, paramKey, e.target.value)}
          >
            {supportedFormats.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }
    
    if (paramConfig.type === 'select') {
      return (
        <div className="mb-2" key={paramKey}>
          <label className="block text-xs text-slate-400 mb-1">{paramConfig.description}</label>
          <select 
            className="w-full p-1.5 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:border-cyan-400 transition-colors"
            value={value}
            onChange={(e) => updateStageSubParam(stage, subType, paramKey, e.target.value)}
          >
            {paramConfig.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }
    
    return (
      <SliderControl
        key={paramKey}
        label={paramConfig.description}
        value={value}
        min={paramConfig.min}
        max={paramConfig.max}
        step={paramConfig.step}
        unit={paramConfig.unit || ''}
        onChange={(val) => updateStageSubParam(stage, subType, paramKey, val)}
        color={stage === 'stage1' ? 'cyan' : 'red'}
      />
    );
  };

  const renderStage3ParameterControl = (paramKey, paramConfig) => {
    const value = parameters.stage3.params[paramKey];
    
    if (paramConfig.type === 'select') {
      return (
        <div className="mb-2" key={paramKey}>
          <label className="block text-xs text-slate-400 mb-1">{paramConfig.description}</label>
          <select 
            className="w-full p-1.5 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:border-purple-400 transition-colors"
            value={value}
            onChange={(e) => updateStage3Parameter(paramKey, e.target.value)}
          >
            {paramConfig.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }
    
    return (
      <SliderControl
        key={paramKey}
        label={paramConfig.description}
        value={value}
        min={paramConfig.min}
        max={paramConfig.max}
        step={paramConfig.step}
        unit={paramConfig.unit || ''}
        onChange={(val) => updateStage3Parameter(paramKey, val)}
        color="purple"
      />
    );
  };

  // 滑块控件组件
  const SliderControl = ({ label, value, min, max, step, onChange, unit = '', color = 'cyan' }) => {
    const trackColors = {
      cyan: 'rgb(0 200 255)',
      red: 'rgb(236 72 153)',
      purple: 'rgb(139 92 246)'
    };
    const trackColor = trackColors[color] || trackColors.cyan;

    return (
      <div className="mb-2">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-400">{label}</span>
          <span className="text-xs font-medium text-white">{value}{unit}</span>
        </div>
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, ${trackColor} 0%, ${trackColor} ${((value - min) / (max - min)) * 100}%, rgb(71 85 105) ${((value - min) / (max - min)) * 100}%, rgb(71 85 105) 100%)`
            }} 
          />
        </div>
      </div>
    );
  };

  // 阶段面板组件
  const StagePanel = ({ 
    stageId, 
    title, 
    subtitle, 
    icon: Icon, 
    color = 'cyan',
    isOptional = false,
    children 
  }) => {
    const isExpanded = expandedStages[stageId];
    const isEnabled = stageEnabled[stageId];
    
    const colorClasses = {
      cyan: {
        border: 'border-cyan-400',
        bg: 'bg-cyan-900/20',
        text: 'text-cyan-400',
        icon: 'text-cyan-400'
      },
      red: {
        border: 'border-pink-500',
        bg: 'bg-pink-900/20',
        text: 'text-pink-400',
        icon: 'text-pink-400'
      },
      purple: {
        border: 'border-purple-500',
        bg: 'bg-purple-900/20',
        text: 'text-purple-400',
        icon: 'text-purple-400'
      }
    };

    return (
      <div className="mb-3">
        <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${
          isEnabled ? colorClasses[color].border : 'border-slate-600'
        } bg-slate-800/80 backdrop-blur-sm`}>
          <div 
            className={`p-2 cursor-pointer transition-all duration-300 ${
              isEnabled ? colorClasses[color].bg : 'bg-slate-700/50'
            }`}
            onClick={() => toggleStage(stageId)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded ${isEnabled ? `bg-gradient-to-r from-${color}-400 to-${color === 'cyan' ? 'blue' : color === 'red' ? 'pink' : 'indigo'}-500` : 'bg-slate-600'}`}>
                  <Icon className="h-3 w-3 text-white" />
                </div>
                <div>
                  <h3 className={`font-medium text-sm ${isEnabled ? 'text-white' : 'text-slate-400'}`}>
                    {title}
                  </h3>
                  <p className={`text-xs ${isEnabled ? colorClasses[color].text : 'text-slate-500'}`}>
                    {subtitle}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isOptional && (
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-slate-400">启用</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleStageEnabled(stageId);
                      }}
                      className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${
                        isEnabled ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-slate-600'
                      }`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                        isEnabled ? 'translate-x-3.5' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                )}
                <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                  {isExpanded ? 
                    <ChevronUp className={`h-3 w-3 ${isEnabled ? colorClasses[color].icon : 'text-slate-500'}`} /> :
                    <ChevronDown className={`h-3 w-3 ${isEnabled ? colorClasses[color].icon : 'text-slate-500'}`} />
                  }
                </div>
              </div>
            </div>
          </div>
          
          {isExpanded && isEnabled && (
            <div className="p-3 bg-slate-800/50">
              {children}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* 背景效果 */}
      <div className="fixed inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-purple-900/10"></div>
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(28,58,111,0.1)_0%,transparent_15%),radial-gradient(circle_at_90%_80%,rgba(0,229,255,0.05)_0%,transparent_20%)]"></div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-4">
          {/* 页面标题 */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-white bg-clip-text text-transparent">
              高阶退化模型可视化
            </h1>
            <p className="text-sm text-slate-300">
              通过(2+[1])模型模拟广电老旧视频的完整退化过程，生成符合真实特征的降质样本
            </p>
          </div>

          {/* 错误和成功提示 */}
          {errorMessage && (
            <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-2 mb-3 flex items-center">
              <AlertCircle className="h-4 w-4 text-red-400 mr-2" />
              <p className="text-red-300 text-xs flex-1">{errorMessage}</p>
              <button onClick={clearError} className="ml-2 text-red-400 hover:text-red-300">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-2 mb-3 flex items-center">
              <Info className="h-4 w-4 text-green-400 mr-2" />
              <p className="text-green-300 text-xs">{successMessage}</p>
            </div>
          )}

          {/* 文件上传区域 - 横向布局 */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-4 mb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*,video/*"
              className="hidden"
            />
            
            <div className="flex gap-4 items-center">
              {!uploadedFile ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={handleUploadClick}
                  className={`flex-1 border-2 border-dashed rounded-lg p-6 text-center transition-all duration-300 cursor-pointer ${
                    isDragOver
                      ? 'border-cyan-400 bg-cyan-400/10'
                      : 'border-cyan-400/30 hover:border-cyan-400 hover:bg-cyan-400/5'
                  }`}
                  disabled={isUploading}
                >
                  <div className="flex items-center justify-center gap-4">
                    <Upload className="h-8 w-8 text-cyan-400" />
                    <div className="text-left">
                      <h3 className="text-base font-medium text-white mb-1">上传原始媒体文件</h3>
                      <p className="text-sm text-slate-400">点击或拖放图像/视频文件到此处</p>
                      <p className="text-xs text-slate-500 mt-1">支持格式: JPG, PNG, MP4, MOV, AVI, MKV, WEBM (最大100MB)</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-slate-700/50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="flex-shrink-0">
                        {getFileIcon(uploadedFile)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate" title={uploadedFile.name}>
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-slate-400">
                          {uploadedFile.type} • {formatFileSize(uploadedFile.size)}
                        </p>
                        {isUploading && (
                          <div className="mt-1">
                            <div className="h-1 bg-slate-600 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{uploadProgress}%</p>
                          </div>
                        )}
                      </div>
                      
                      {!isUploading && (
                        <button
                          onClick={handleRemoveFile}
                          className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* 控制按钮 */}
              <div className="flex space-x-2">
                <button
                  onClick={applyDegradation}
                  disabled={isProcessing || isUploading || !mediaPath}
                  className={`flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    (isProcessing || isUploading || !mediaPath)
                      ? 'bg-slate-600 cursor-not-allowed text-slate-400' 
                      : 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white shadow-lg'
                  }`}
                >
                  <Play className="h-4 w-4 mr-1" />
                  <span className="text-sm">{isProcessing ? `处理中 ${progress}%` : '开始处理'}</span>
                </button>
                
                <button
                  onClick={resetParameters}
                  disabled={isProcessing || isUploading}
                  className="px-3 py-2 border border-cyan-400 text-cyan-400 rounded-lg hover:bg-cyan-400/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="重置参数"
                >
                  <RotateCcw className="h-4 w-4" />
                </button>
                
                <button 
                  onClick={downloadResult}
                  disabled={!processedPreviewUrl}
                  className={`flex items-center px-3 py-2 rounded-lg transition-all duration-300 ${
                    processedPreviewUrl
                      ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
                      : 'bg-slate-600 text-slate-400 cursor-not-allowed'
                  }`}
                  title="下载结果"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {/* 左侧参数配置面板 */}
            <div className="w-1/2">
              <div className="bg-slate-800/80 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-2">
                    <Sliders className="h-3 w-3 text-white" />
                  </div>
                  退化参数配置
                </h2>

                {/* 第一阶段（复合退化） */}
                <StagePanel
                  stageId="stage1"
                  title="第一阶段退化"
                  subtitle="必选 · 基础退化层（复合类型）"
                  icon={Layers}
                  color="cyan"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-700/50 rounded p-2">
                      <h4 className="text-xs font-medium text-white mb-2 flex items-center">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full mr-1"></div>
                        {DEGRADATION_CONFIG.common.blur.name}
                      </h4>
                      {renderSubParameterControl('stage1', 'blur', 'kernel_size', DEGRADATION_CONFIG.common.blur.params.kernel_size)}
                      {renderSubParameterControl('stage1', 'blur', 'sigma', DEGRADATION_CONFIG.common.blur.params.sigma)}
                    </div>
                    
                    <div className="bg-slate-700/50 rounded p-2">
                      <h4 className="text-xs font-medium text-white mb-2 flex items-center">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full mr-1"></div>
                        {DEGRADATION_CONFIG.common.resample.name}
                      </h4>
                      {renderSubParameterControl('stage1', 'resample', 'scale_factor', DEGRADATION_CONFIG.common.resample.params.scale_factor)}
                      {renderSubParameterControl('stage1', 'resample', 'interpolation', DEGRADATION_CONFIG.common.resample.params.interpolation)}
                    </div>
                    
                    <div className="bg-slate-700/50 rounded p-2">
                      <h4 className="text-xs font-medium text-white mb-2 flex items-center">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full mr-1"></div>
                        {DEGRADATION_CONFIG.common.noise.name}
                      </h4>
                      {renderSubParameterControl('stage1', 'noise', 'noise_type', DEGRADATION_CONFIG.common.noise.params.noise_type)}
                      {renderSubParameterControl('stage1', 'noise', 'intensity', DEGRADATION_CONFIG.common.noise.params.intensity)}
                      {parameters.stage1.noise.noise_type === 'salt_pepper' && 
                        renderSubParameterControl('stage1', 'noise', 'density', DEGRADATION_CONFIG.common.noise.params.density)
                      }
                    </div>
                    
                    <div className="bg-slate-700/50 rounded p-2">
                      <h4 className="text-xs font-medium text-white mb-2 flex items-center">
                        <div className="w-1 h-1 bg-cyan-400 rounded-full mr-1"></div>
                        {DEGRADATION_CONFIG.common.compression.name}
                      </h4>
                      {renderSubParameterControl('stage1', 'compression', 'format', DEGRADATION_CONFIG.common.compression.params.format)}
                      {renderSubParameterControl('stage1', 'compression', 'quality', DEGRADATION_CONFIG.common.compression.params.quality)}
                      {renderSubParameterControl('stage1', 'compression', 'bitrate', DEGRADATION_CONFIG.common.compression.params.bitrate)}
                    </div>
                  </div>
                </StagePanel>

                {/* 第二阶段（复合退化） */}
                <StagePanel
                  stageId="stage2"
                  title="第二阶段退化"
                  subtitle="必选 · 累积退化层（复合类型）"
                  icon={Layers}
                  color="red"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-700/50 rounded p-2">
                      <h4 className="text-xs font-medium text-white mb-2 flex items-center">
                        <div className="w-1 h-1 bg-pink-400 rounded-full mr-1"></div>
                        {DEGRADATION_CONFIG.common.blur.name}
                      </h4>
                      {renderSubParameterControl('stage2', 'blur', 'kernel_size', DEGRADATION_CONFIG.common.blur.params.kernel_size)}
                      {renderSubParameterControl('stage2', 'blur', 'sigma', DEGRADATION_CONFIG.common.blur.params.sigma)}
                    </div>
                    
                    <div className="bg-slate-700/50 rounded p-2">
                      <h4 className="text-xs font-medium text-white mb-2 flex items-center">
                        <div className="w-1 h-1 bg-pink-400 rounded-full mr-1"></div>
                        {DEGRADATION_CONFIG.common.resample.name}
                      </h4>
                      {renderSubParameterControl('stage2', 'resample', 'scale_factor', DEGRADATION_CONFIG.common.resample.params.scale_factor)}
                      {renderSubParameterControl('stage2', 'resample', 'interpolation', DEGRADATION_CONFIG.common.resample.params.interpolation)}
                    </div>
                    
                    <div className="bg-slate-700/50 rounded p-2">
                      <h4 className="text-xs font-medium text-white mb-2 flex items-center">
                        <div className="w-1 h-1 bg-pink-400 rounded-full mr-1"></div>
                        {DEGRADATION_CONFIG.common.noise.name}
                      </h4>
                      {renderSubParameterControl('stage2', 'noise', 'noise_type', DEGRADATION_CONFIG.common.noise.params.noise_type)}
                      {renderSubParameterControl('stage2', 'noise', 'intensity', DEGRADATION_CONFIG.common.noise.params.intensity)}
                      {parameters.stage2.noise.noise_type === 'salt_pepper' && 
                        renderSubParameterControl('stage2', 'noise', 'density', DEGRADATION_CONFIG.common.noise.params.density)
                      }
                    </div>
                    
                    <div className="bg-slate-700/50 rounded p-2">
                      <h4 className="text-xs font-medium text-white mb-2 flex items-center">
                        <div className="w-1 h-1 bg-pink-400 rounded-full mr-1"></div>
                        {DEGRADATION_CONFIG.common.compression.name}
                      </h4>
                      {renderSubParameterControl('stage2', 'compression', 'format', DEGRADATION_CONFIG.common.compression.params.format)}
                      {renderSubParameterControl('stage2', 'compression', 'quality', DEGRADATION_CONFIG.common.compression.params.quality)}
                      {renderSubParameterControl('stage2', 'compression', 'bitrate', DEGRADATION_CONFIG.common.compression.params.bitrate)}
                    </div>
                  </div>
                </StagePanel>

                {/* 第三阶段（可选单一退化） */}
                <StagePanel
                  stageId="stage3"
                  title="第三阶段退化"
                  subtitle="可选 · 特定场景退化（单一类型）"
                  icon={Cog}
                  color="purple"
                  isOptional={true}
                >
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-slate-700/50 rounded p-2">
                      <h4 className="text-xs font-medium text-white mb-2 flex items-center">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mr-1"></div>
                        媒体类型选择
                      </h4>
                      <div className="mb-2">
                        <label className="block text-xs text-slate-400 mb-1">媒体类型</label>
                        <select 
                          className="w-full p-1.5 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:border-purple-400 transition-colors"
                          value={parameters.stage3.mediaType}
                          onChange={(e) => handleStage3MediaTypeChange(e.target.value)}
                        >
                          <option value="">选择媒体类型</option>
                          <option value="image">图像退化</option>
                          <option value="video">视频退化</option>
                        </select>
                      </div>
                      
                      {parameters.stage3.mediaType && (
                        <div className="mb-2">
                          <label className="block text-xs text-slate-400 mb-1">退化类型</label>
                          <select 
                            className="w-full p-1.5 bg-slate-800 border border-slate-600 rounded text-xs text-white focus:border-purple-400 transition-colors"
                            value={parameters.stage3.degradationType}
                            onChange={(e) => handleStage3DegradationTypeChange(e.target.value)}
                          >
                            <option value="">选择退化类型</option>
                            {Object.entries(DEGRADATION_CONFIG[parameters.stage3.mediaType] || {}).map(([key, config]) => (
                              <option key={key} value={key}>{config.name}</option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <div className="bg-slate-700/50 rounded p-2">
                      <h4 className="text-xs font-medium text-white mb-2 flex items-center">
                        <div className="w-1 h-1 bg-purple-400 rounded-full mr-1"></div>
                        退化参数
                      </h4>
                      {parameters.stage3.mediaType && 
                       parameters.stage3.degradationType && 
                       DEGRADATION_CONFIG[parameters.stage3.mediaType][parameters.stage3.degradationType] ? (
                        <div>
                          <p className="text-xs text-slate-400 mb-2">
                            {DEGRADATION_CONFIG[parameters.stage3.mediaType][parameters.stage3.degradationType].method}
                          </p>
                          {Object.entries(DEGRADATION_CONFIG[parameters.stage3.mediaType][parameters.stage3.degradationType].params).map(([key, config]) => 
                            renderStage3ParameterControl(key, config)
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-slate-400">请先选择媒体类型和退化类型</p>
                      )}
                    </div>
                  </div>
                </StagePanel>
              </div>
            </div>

            {/* 右侧预览区域 */}
            <div className="w-1/2">
              <div className="bg-slate-800/80 backdrop-blur-sm border border-cyan-400/20 rounded-lg p-4">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <div className="w-6 h-6 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mr-2">
                    <Eye className="h-3 w-3 text-white" />
                  </div>
                  退化过程预览
                </h2>
                
                <div className="space-y-4">
                  {/* 原始文件预览 */}
                  <div className="bg-slate-700/50 rounded-lg overflow-hidden border border-slate-600">
                    <div className="aspect-video bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center">
                      {uploadedFile && filePreviewUrl && !isUploading ? (
                        uploadedFile.type.startsWith('image/') ? (
                          <img
                            src={filePreviewUrl}
                            alt="原始图像"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={filePreviewUrl}
                            className="w-full h-full object-cover"
                            controls
                            muted
                          />
                        )
                      ) : (
                        <span className="text-white text-sm font-medium">原始图像</span>
                      )}
                    </div>
                    <div className="p-2 bg-slate-800">
                      <p className="text-sm font-medium text-white">原始图像</p>
                      <p className="text-xs text-slate-400">
                        {uploadedFile && !isUploading ? uploadedFile.name : '未经处理的原始媒体文件'}
                      </p>
                    </div>
                  </div>
        
                  {/* 处理结果预览 */}
                  <div className="bg-slate-700/50 rounded-lg overflow-hidden border border-purple-400/50">
                    <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-purple-800/50 flex items-center justify-center relative">
                      {processedPreviewUrl ? (
                        mediaType === 'image' ? (
                          <img
                            src={processedPreviewUrl}
                            alt="退化结果"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <video
                            src={processedPreviewUrl}
                            className="w-full h-full object-cover"
                            controls
                            muted
                          />
                        )
                      ) : (
                        <span className="text-purple-300 text-sm font-medium">
                          {isProcessing ? '正在处理...' : '最终退化结果'}
                        </span>
                      )}
                      {isProcessing && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-white text-center">
                            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p className="text-sm">{progress}%</p>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-2 bg-purple-900/20 border-l-2 border-purple-400">
                      <p className="text-sm font-medium text-purple-300">最终退化结果</p>
                      <p className="text-xs text-purple-400/80">
                        {stageEnabled.stage3 ? '完整退化流程处理后的结果' : '两阶段退化处理后的结果'}
                      </p>
                    </div>
                  </div>

                  {/* 处理流程图示 */}
                  <div className="bg-slate-700/30 rounded-lg p-3">
                    <h3 className="text-sm font-medium text-white mb-2">处理流程</h3>
                    <div className="flex items-center justify-between text-xs">
                      <div className={`flex items-center space-x-1 ${stageEnabled.stage1 ? 'text-cyan-400' : 'text-slate-500'}`}>
                        <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                        <span>第一阶段</span>
                      </div>
                      <ArrowRight className="h-3 w-3 text-slate-400" />
                      <div className={`flex items-center space-x-1 ${stageEnabled.stage2 ? 'text-pink-400' : 'text-slate-500'}`}>
                        <div className="w-2 h-2 rounded-full bg-pink-400"></div>
                        <span>第二阶段</span>
                      </div>
                      {stageEnabled.stage3 && (
                        <>
                          <ArrowRight className="h-3 w-3 text-slate-400" />
                          <div className="flex items-center space-x-1 text-purple-400">
                            <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                            <span>第三阶段</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoDegrade;