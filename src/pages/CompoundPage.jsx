import React, { useState, useRef, useEffect } from 'react';
import {
  Upload, Download, Settings, Image, Video, RefreshCw,
  Eye, Save, Trash2, X, Info, Clock, Monitor, FileVideo, Zap,
  ChevronRight, ChevronLeft, Check, AlertCircle
} from 'lucide-react';
import { DEGRADATION_CONFIG } from '../data/DEGRADATION_CONFIG';

// API工具函数
const API_BASE_URL = "http://localhost:8000/api";

// 文件上传
const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "文件上传失败");
  }
  
  return response.json();
};

// 复合退化处理
const processCompositeDegradation = async (params) => {
  const response = await fetch(`${API_BASE_URL}/composite-degradation`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "处理失败");
  }
  
  return response.json();
};

// 获取媒体信息
const getMediaInfo = async (filePath) => {
  const response = await fetch(`${API_BASE_URL}/media-info`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ file_path: filePath }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.detail || "获取媒体信息失败");
  }
  
  return response.json();
};

// 获取文件访问URL
const getFileUrl = (filePath) => {
  return `${API_BASE_URL}/file?path=${encodeURIComponent(filePath)}`;
};

// 格式化时长（秒 → MM:SS）
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// 阶段配置
const STAGES = [
  { id: 'stage1', title: '第一阶退化过程（必选，降质全选）', required: true },
  { id: 'stage2', title: '第二阶退化过程（必选，降质全选）', required: true },
  { id: 'stage3', title: '第三阶退化过程（可选）', required: false }
];

// 第一、二阶段必须包含的退化类型
const STAGE1_2_TYPES = ['blur', 'resample', 'noise', 'compression'];

const ThreeStageDegradationSystem = () => {
  // 文件状态管理
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null); // 'image' 或 'video'
  const [originalUrl, setOriginalUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [backendFilePath, setBackendFilePath] = useState(null); // 后端文件路径
  const fileInputRef = useRef(null);

  // 媒体信息
  const [mediaInfo, setMediaInfo] = useState({
    original: { name: '', size: '', type: '', resolution: '', codec: '', duration: '', frameRate: '', bitRate: '' },
    processed: { name: '', size: '', type: '', resolution: '', codec: '', duration: '', frameRate: '', bitRate: '' }
  });

  // 处理状态
  const [activeStage, setActiveStage] = useState('stage1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isComplete, setIsComplete] = useState(false);
  const [configErrors, setConfigErrors] = useState([]);

  // 退化配置状态 - 结构: { stage1: { blur: {...}, resample: {...}, ... }, ... }
  const [degradationConfig, setDegradationConfig] = useState({});

  // 初始化退化配置
  useEffect(() => {
    const initialConfig = {};
    const missingConfigs = []; // 记录缺失的配置项
    
    // 初始化第一、二阶段
    ['stage1', 'stage2'].forEach(stage => {
      initialConfig[stage] = {};
      STAGE1_2_TYPES.forEach(type => {
        // 检查配置是否存在
        const typeConfig = DEGRADATION_CONFIG.common?.[type];
        if (!typeConfig) {
          missingConfigs.push(`阶段 ${stage} 缺少退化类型 "${type}" 的配置`);
          return;
        }
        
        const params = {};
        Object.entries(typeConfig.params).forEach(([paramKey, param]) => {
          params[paramKey] = param.default;
        });
        initialConfig[stage][type] = { enabled: true, params };
      });
    });
    
    // 初始化第三阶段
    initialConfig.stage3 = {
      type: null,
      params: {}
    };
    
    setDegradationConfig(initialConfig);
    // 如果有缺失的配置，记录错误
    if (missingConfigs.length > 0) {
      setConfigErrors(missingConfigs);
      console.warn('检测到缺失的退化配置:', missingConfigs);
    }
  }, []);

  // 处理文件上传
  const handleFileUpload = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // 重置状态
    setFile(selectedFile);
    setError(null);
    setProcessedUrl(null);
    setIsComplete(false);
    setIsProcessing(true); // 显示上传中状态

    try {
      // 调用文件上传接口
      const uploadResult = await uploadFile(selectedFile);
      const { file_path: backendFilePath, content_type } = uploadResult.data;
      
      // 确定文件类型（image/video）
      const mediaType = content_type.startsWith('image/') ? 'image' : 'video';
      setFileType(mediaType);
      setBackendFilePath(backendFilePath); // 保存后端文件路径

      // 获取原始文件信息
      const mediaInfo = await getMediaInfo(backendFilePath);
      setMediaInfo(prev => ({
        ...prev,
        original: {
          name: selectedFile.name,
          size: mediaInfo.file_size_human,
          type: content_type,
          resolution: mediaInfo.width && mediaInfo.height 
            ? `${mediaInfo.width}x${mediaInfo.height}` 
            : '未知',
          codec: mediaType === 'image' 
            ? mediaInfo.format || '未知' 
            : mediaInfo.video_codec || '未知',
          duration: mediaType === 'video' && mediaInfo.duration
            ? formatDuration(mediaInfo.duration) 
            : '-',
          frameRate: mediaType === 'video' && mediaInfo.fps
            ? `${mediaInfo.fps}fps` 
            : '-',
          bitRate: mediaInfo.bitrate 
            ? `${(mediaInfo.bitrate / 1024 / 1024).toFixed(2)}Mbps` 
            : '未知'
        }
      }));

      // 设置原始文件预览URL（通过后端接口访问）
      setOriginalUrl(getFileUrl(backendFilePath));

    } catch (err) {
      setError(`上传失败: ${err.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  // 更新参数值
  const handleParamChange = (stage, type, paramKey, value) => {
    setDegradationConfig(prev => ({
      ...prev,
      [stage]: {
        ...prev[stage],
        [type]: {
          ...prev[stage][type],
          params: {
            ...prev[stage][type].params,
            [paramKey]: value
          }
        }
      }
    }));
  };

  // 选择第三阶段退化类型
  const handleStage3TypeChange = (type) => {
    // 初始化选中类型的默认参数
    const params = {};
    if (type) {
      const typeConfig = fileType === 'image' 
        ? DEGRADATION_CONFIG.image?.[type]
        : DEGRADATION_CONFIG.video?.[type];
      
      if (!typeConfig) {
        setError(`未找到 ${type} 类型的退化配置`);
        return;
      }
      
      Object.entries(typeConfig.params).forEach(([paramKey, param]) => {
        params[paramKey] = param.default;
      });
    }

    setDegradationConfig(prev => ({
      ...prev,
      stage3: {
        type,
        params
      }
    }));
  };

  // 更新第三阶段参数
  const handleStage3ParamChange = (paramKey, value) => {
    setDegradationConfig(prev => ({
      ...prev,
      stage3: {
        ...prev.stage3,
        params: {
          ...prev.stage3.params,
          [paramKey]: value
        }
      }
    }));
  };

  // 验证配置是否完整
  const validateConfig = () => {
    // 检查是否有配置缺失错误
    if (configErrors.length > 0) {
      return { valid: false, message: '存在缺失的退化配置，请检查配置文件' };
    }

    // 检查第一、二阶段是否都配置了所有退化类型
    for (const stage of ['stage1', 'stage2']) {
      for (const type of STAGE1_2_TYPES) {
        if (!degradationConfig[stage]?.[type]?.enabled) {
          return { valid: false, message: `${STAGES.find(s => s.id === stage).title}中的${DEGRADATION_CONFIG.common[type]?.name || type}未启用` };
        }
      }
    }
    return { valid: true };
  };

  // 处理退化过程
  const handleProcess = async () => {
    if (!file || !backendFilePath) {
      setError('请先上传文件');
      return;
    }

    // 验证配置
    const validation = validateConfig();
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setError(null);
    setIsComplete(false);

    try {
      // 构建后端需要的参数格式
      const degradationParams = {
        media_path: backendFilePath, // 后端文件相对路径
        media_type: fileType,
        first_degradation_config: {
          name: "composite", // 第一阶段为复合处理
          params: degradationConfig.stage1 // 包含blur/resample/noise/compression
        },
        second_degradation_config: {
          name: "composite", // 第二阶段为复合处理
          params: degradationConfig.stage2
        },
        third_degradation_config: degradationConfig.stage3.type 
          ? {
              name: degradationConfig.stage3.type,
              params: degradationConfig.stage3.params
            } 
          : null
      };

      // 调用后端复合退化接口
      const processResult = await processCompositeDegradation(degradationParams);
      const { processed_path: processedFilePath } = processResult.data;

      // 获取处理后文件的信息
      const processedMediaInfo = await getMediaInfo(processedFilePath);

      // 更新处理后文件状态
      setProcessedUrl(getFileUrl(processedFilePath));
      setIsComplete(true);
      setMediaInfo(prev => ({
        ...prev,
        processed: {
          name: processedMediaInfo.file_name || `processed_${prev.original.name}`,
          size: processedMediaInfo.file_size_human,
          type: prev.original.type,
          resolution: processedMediaInfo.width && processedMediaInfo.height
            ? `${processedMediaInfo.width}x${processedMediaInfo.height}`
            : '未知',
          codec: fileType === 'image'
            ? processedMediaInfo.format || '未知'
            : processedMediaInfo.video_codec || '未知',
          duration: prev.original.duration,
          frameRate: prev.original.frameRate,
          bitRate: processedMediaInfo.bitrate
            ? `${(processedMediaInfo.bitrate / 1024 / 1024).toFixed(2)}Mbps`
            : '未知'
        }
      }));

      // 模拟进度更新（实际项目可通过WebSocket实时获取进度）
      const totalSteps = 2 + (degradationConfig.stage3.type ? 1 : 0);
      let currentProgress = 0;
      const stepProgress = 100 / totalSteps;
      
      // 第一阶段进度
      setProcessingStage('第一阶段');
      for (let i = 0; i < 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        currentProgress += stepProgress / 4;
        setProgress(currentProgress);
      }
      
      // 第二阶段进度
      setProcessingStage('第二阶段');
      for (let i = 0; i < 4; i++) {
        await new Promise(resolve => setTimeout(resolve, 300));
        currentProgress += stepProgress / 4;
        setProgress(currentProgress);
      }
      
      // 第三阶段进度
      if (degradationConfig.stage3.type) {
        setProcessingStage('第三阶段');
        await new Promise(resolve => setTimeout(resolve, 1000));
        currentProgress += stepProgress;
        setProgress(currentProgress);
      }

    } catch (err) {
      setError(`处理失败: ${err.message}`);
    } finally {
      setIsProcessing(false);
      setProcessingStage('');
      setProgress(100);
    }
  };

  // 保存结果和配置
  const handleSave = () => {
    if (!processedUrl || !backendFilePath) {
      setError('请先完成退化处理');
      return;
    }

    // 1. 下载处理后文件（通过后端文件接口）
    const processedFileUrl = getFileUrl(mediaInfo.processed.name);
    const fileLink = document.createElement('a');
    fileLink.href = processedFileUrl;
    fileLink.download = mediaInfo.processed.name;
    fileLink.click();

    // 2. 保存参数配置
    const configData = {
      stages: degradationConfig,
      fileInfo: {
        original: mediaInfo.original,
        processed: mediaInfo.processed
      },
      timestamp: new Date().toISOString(),
      processingSteps: [
        '第一阶段：模糊 → 下采样 → 噪声 → 编码压缩',
        '第二阶段：模糊 → 下采样 → 噪声 → 编码压缩',
        degradationConfig.stage3.type ? `第三阶段：${
          fileType === 'image' 
            ? DEGRADATION_CONFIG.image[degradationConfig.stage3.type]?.name || degradationConfig.stage3.type
            : DEGRADATION_CONFIG.video[degradationConfig.stage3.type]?.name || degradationConfig.stage3.type
        }` : '未使用第三阶段'
      ]
    };
    
    const configBlob = new Blob(
      [JSON.stringify(configData, null, 2)],
      { type: 'application/json' }
    );
    const configUrl = URL.createObjectURL(configBlob);
    
    const configLink = document.createElement('a');
    configLink.href = configUrl;
    configLink.download = `degradation_config_${Date.now()}.json`;
    configLink.click();

    // 清理
    URL.revokeObjectURL(configUrl);
  };

  // 格式化文件大小
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  // 渲染参数控件
  const renderParamControl = (paramKey, paramConfig, value, onChange) => {
    // 检查参数配置是否存在
    if (!paramConfig) {
      return <div className="text-red-500 text-sm">缺失参数配置: {paramKey}</div>;
    }

    if (paramConfig.type === 'select') {
      return (
        <div className="mb-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {paramConfig.description}
          </label>
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          >
            {paramConfig.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    } else {
      return (
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">
              {paramConfig.description}
            </label>
            <span className="text-sm text-gray-500">
              {value}
              {paramConfig.unit || ''}
            </span>
          </div>
          <input
            type="range"
            min={paramConfig.min}
            max={paramConfig.max}
            step={paramConfig.step}
            value={value}
            onChange={(e) => {
              const val = paramConfig.type === 'int' 
                ? parseInt(e.target.value) 
                : parseFloat(e.target.value);
              onChange(val);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            disabled={isProcessing}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{paramConfig.min}{paramConfig.unit || ''}</span>
            <span>{paramConfig.max}{paramConfig.unit || ''}</span>
          </div>
        </div>
      );
    }
  };

  // 渲染第一、二阶段的退化配置
  const renderStage1_2 = (stage) => {
    // 如果有配置错误，显示提示
    if (configErrors.length > 0) {
      return (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h4 className="text-red-700 font-medium mb-2 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            配置错误
          </h4>
          <ul className="text-sm text-red-600 space-y-1">
            {configErrors.map((err, i) => (
              <li key={i}>- {err}</li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <p className="text-sm text-gray-600">
          本阶段将依次应用以下退化处理：模糊 → 下采样 → 噪声 → 编码压缩
        </p>
        
        {STAGE1_2_TYPES.map((type, index) => {
          // 检查配置是否存在
          const typeConfig = DEGRADATION_CONFIG.common?.[type];
          if (!typeConfig) {
            return (
              <div key={type} className="border border-red-200 bg-red-50 rounded-lg p-4">
                <p className="text-red-600 text-sm">
                  缺失退化类型配置: {type}（请检查 DEGRADATION_CONFIG.common）
                </p>
              </div>
            );
          }
          
          const stageConfig = degradationConfig[stage]?.[type] || {};
          
          return (
            <div key={type} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-100 text-blue-600 text-sm font-medium mr-2">
                    {index + 1}
                  </div>
                  <h4 className="font-medium text-gray-900">{typeConfig.name}</h4>
                </div>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {typeConfig.method || '默认方法'}
                </span>
              </div>
              
              <div className="pl-8">
                {Object.entries(typeConfig.params).map(([paramKey, paramConfig]) => (
                  renderParamControl(
                    paramKey,
                    paramConfig,
                    stageConfig.params?.[paramKey] || paramConfig.default,
                    (value) => handleParamChange(stage, type, paramKey, value)
                  )
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // 渲染第三阶段的退化配置
  const renderStage3 = () => {
    if (!fileType) {
      return (
        <div className="p-6 text-center text-gray-500">
          请先上传文件以配置第三阶段退化
        </div>
      );
    }

    const availableTypes = fileType === 'image' 
      ? DEGRADATION_CONFIG.image 
      : DEGRADATION_CONFIG.video;
    
    const currentType = degradationConfig.stage3?.type;
    const typeConfig = currentType 
      ? (fileType === 'image' ? DEGRADATION_CONFIG.image[currentType] : DEGRADATION_CONFIG.video[currentType])
      : null;

    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">
          {fileType === 'image' 
            ? '针对图像，请选择一种降质问题' 
            : '针对视频，请选择一种降质问题'}
        </p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            选择退化类型
          </label>
          <select
            value={currentType || ''}
            onChange={(e) => handleStage3TypeChange(e.target.value || null)}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          >
            <option value="">请选择...</option>
            {Object.entries(availableTypes).map(([typeKey, typeInfo]) => (
              <option key={typeKey} value={typeKey}>
                {typeInfo.name} ({typeInfo.method})
              </option>
            ))}
          </select>
        </div>
        
        {currentType && typeConfig && (
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">{typeConfig.name}</h4>
            
            {Object.entries(typeConfig.params).map(([paramKey, paramConfig]) => (
              renderParamControl(
                paramKey,
                paramConfig,
                degradationConfig.stage3.params?.[paramKey] || paramConfig.default,
                (value) => handleStage3ParamChange(paramKey, value)
              )
            ))}
          </div>
        )}
      </div>
    );
  };

  // 渲染阶段内容
  const renderStageContent = () => {
    switch (activeStage) {
      case 'stage1':
      case 'stage2':
        return renderStage1_2(activeStage);
      case 'stage3':
        return renderStage3();
      default:
        return null;
    }
  };

  // 渲染阶段导航
  const renderStageNavigation = () => {
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

  return (
    <div className="pt-24 pb-16">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6 flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
            <button 
              onClick={() => setError(null)} 
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* 顶部展示图 */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-8 text-center text-white">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">三阶段复合媒体退化系统</h2>
            <p className="max-w-2xl mx-auto opacity-90">
              按照指定顺序依次应用多阶段退化处理，支持图像和视频文件，可配置详细的退化参数
            </p>
          </div>
        </div>

        {/* 文件上传区域 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Upload className="h-5 w-5 mr-2 text-blue-600" />
            文件上传
          </h2>
          
          <div 
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              file ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-blue-400'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            
            {!file ? (
              <>
                <div className="flex justify-center mb-4">
                  <Image className="h-12 w-12 text-gray-400 mr-3" />
                  <Video className="h-12 w-12 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-4">拖放文件到此处或点击选择</p>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  disabled={isProcessing}
                >
                  选择图像/视频文件
                </button>
              </>
            ) : (
              <div className="text-left">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {fileType === 'image' ? (
                      <Image className="h-10 w-10 text-green-500" />
                    ) : (
                      <Video className="h-10 w-10 text-green-500" />
                    )}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-900">{file.name}</h3>
                    <p className="text-sm text-gray-500">
                      {fileType === 'image' ? '图像文件' : '视频文件'} · {mediaInfo.original.size}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setFileType(null);
                      setOriginalUrl(null);
                      setProcessedUrl(null);
                      setIsComplete(false);
                      setBackendFilePath(null);
                    }}
                    className="ml-auto text-gray-400 hover:text-gray-500"
                    disabled={isProcessing}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 阶段导航 */}
        {renderStageNavigation()}

        {/* 阶段配置区域 */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-800">
              {STAGES.find(s => s.id === activeStage).title}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => {
                  const currentIndex = STAGES.findIndex(s => s.id === activeStage);
                  if (currentIndex > 0) {
                    setActiveStage(STAGES[currentIndex - 1].id);
                  }
                }}
                disabled={activeStage === 'stage1' || isProcessing}
                className={`p-2 rounded-md ${
                  activeStage === 'stage1' || isProcessing
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  const currentIndex = STAGES.findIndex(s => s.id === activeStage);
                  if (currentIndex < STAGES.length - 1) {
                    setActiveStage(STAGES[currentIndex + 1].id);
                  }
                }}
                disabled={activeStage === 'stage3' || isProcessing}
                className={`p-2 rounded-md ${
                  activeStage === 'stage3' || isProcessing
                    ? 'text-gray-300 cursor-not-allowed'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {renderStageContent()}
        </div>

        {/* 处理按钮 */}
        {file && (
          <div className="flex justify-center mb-8">
            <button
              onClick={handleProcess}
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
        )}

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

        {/* 结果对比展示 */}
        {isComplete && (
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <Eye className="h-5 w-5 mr-2 text-blue-600" />
              退化处理结果对比
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 原始文件 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <span>原始文件</span>
                  <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                    {mediaInfo.original.type}
                  </span>
                </h3>
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {fileType === 'image' ? (
                    <img
                      src={originalUrl}
                      alt="Original"
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <video
                      src={originalUrl}
                      controls
                      className="w-full h-64 object-cover"
                    />
                  )}
                </div>
                
                {/* 原始文件信息 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    文件信息
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">名称:</span>
                      <span className="text-gray-900">{mediaInfo.original.name}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">大小:</span>
                      <span className="text-gray-900">{mediaInfo.original.size}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">分辨率:</span>
                      <span className="text-gray-900">{mediaInfo.original.resolution}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">编码格式:</span>
                      <span className="text-gray-900">{mediaInfo.original.codec}</span>
                    </li>
                    {fileType === 'video' && (
                      <>
                        <li className="flex justify-between">
                          <span className="text-gray-600">时长:</span>
                          <span className="text-gray-900">{mediaInfo.original.duration}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">帧率:</span>
                          <span className="text-gray-900">{mediaInfo.original.frameRate}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">码率:</span>
                          <span className="text-gray-900">{mediaInfo.original.bitRate}</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
              
              {/* 处理后文件 */}
              <div>
                <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                  <span>处理后文件</span>
                  <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded">
                    已完成
                  </span>
                </h3>
                <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                  {fileType === 'image' ? (
                    <img
                      src={processedUrl}
                      alt="Processed"
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <video
                      src={processedUrl}
                      controls
                      className="w-full h-64 object-cover"
                    />
                  )}
                </div>
                
                {/* 处理后文件信息 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Info className="h-4 w-4 mr-1" />
                    文件信息
                  </h4>
                  <ul className="space-y-1 text-sm">
                    <li className="flex justify-between">
                      <span className="text-gray-600">名称:</span>
                      <span className="text-gray-900">{mediaInfo.processed.name}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">大小:</span>
                      <span className="text-gray-900">{mediaInfo.processed.size}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">分辨率:</span>
                      <span className="text-gray-900">{mediaInfo.processed.resolution}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">编码格式:</span>
                      <span className="text-gray-900">{mediaInfo.processed.codec}</span>
                    </li>
                    {fileType === 'video' && (
                      <>
                        <li className="flex justify-between">
                          <span className="text-gray-600">时长:</span>
                          <span className="text-gray-900">{mediaInfo.processed.duration}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">帧率:</span>
                          <span className="text-gray-900">{mediaInfo.processed.frameRate}</span>
                        </li>
                        <li className="flex justify-between">
                          <span className="text-gray-600">码率:</span>
                          <span className="text-gray-900">{mediaInfo.processed.bitRate}</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
            
            {/* 保存按钮 */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={handleSave}
                className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 transition-colors flex items-center"
              >
                <Save className="h-5 w-5 mr-2" />
                保存处理结果及参数配置
              </button>
            </div>
          </div>
        )}
      </main>

      {/* 页脚 */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            三阶段复合退化系统 &copy; {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ThreeStageDegradationSystem;

