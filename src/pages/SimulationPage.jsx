import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Upload, Download, Settings, Image, Video, RefreshCw, Eye, Save, Trash2, Info, FolderOpen, ChevronUp } from 'lucide-react';
import { DEGRADATION_TYPES } from '../data/DEGRADATION_TYPES';
import { ParamSlider, ParamSelect } from '../components/ParamControls'; 

// 后端API地址（对应file目录结构）
const API_BASE = 'http://localhost:8000/api';
const BACKEND_FILE_ROOT = 'file';

// 格式化时间（秒转时分秒）
const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '未知';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : 
         `${m}:${s.toString().padStart(2, '0')}`;
};

// 格式化比特率
const formatBitrate = (bitsPerSecond) => {
  if (!bitsPerSecond || isNaN(bitsPerSecond)) return '未知';
  if (bitsPerSecond >= 1000000) {
    return `${(bitsPerSecond / 1000000).toFixed(2)} Mbps`;
  } else if (bitsPerSecond >= 1000) {
    return `${(bitsPerSecond / 1000).toFixed(2)} Kbps`;
  }
  return `${bitsPerSecond} bps`;
};

const LocalVideoDegradationApp = () => {
  const { id } = useParams();
  const selectedType = id;
  const isTypeValid = !!DEGRADATION_TYPES[selectedType];
  
  // 状态管理
  const [params, setParams] = useState({});
  const [backendFilePath, setBackendFilePath] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedUrl, setProcessedUrl] = useState(null);
  const [processedBlob, setProcessedBlob] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);
  const [fileInfo, setFileInfo] = useState(null);
  const [saveInfo, setSaveInfo] = useState(null);
  const [originalMediaInfo, setOriginalMediaInfo] = useState(null);
  const [processedMediaInfo, setProcessedMediaInfo] = useState(null);
  
  // 服务器文件浏览状态
  const [fileList, setFileList] = useState([]);
  const [currentDir, setCurrentDir] = useState('');
  const [parentDir, setParentDir] = useState('');
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [showFileBrowser, setShowFileBrowser] = useState(false);
  
  const processedVideoRef = useRef(null);
  const originalVideoRef = useRef(null);
  
  // 初始化参数（无论是否选择文件都初始化参数）
  useEffect(() => {
    if (!isTypeValid) {
      setError(`无效的退化类型: ${selectedType}`);
      return;
    }

    const defaultParams = {};
    Object.entries(DEGRADATION_TYPES[selectedType].params).forEach(([key, param]) => {
      defaultParams[key] = param.default;
    });
    setParams(defaultParams);
    setError(null);
  }, [selectedType, isTypeValid]);

  // 初始化时加载服务器文件列表
  useEffect(() => {
    fetchFileList();
  }, []);

  // 清理URL对象
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (processedUrl) URL.revokeObjectURL(processedUrl);
    };
  }, [previewUrl, processedUrl]);

  // 从服务器获取文件列表
  const fetchFileList = async (subdir = '') => {
    setIsLoadingFiles(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/file-list`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subdir })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`获取文件列表失败: ${errorText}`);
      }
      
      const result = await response.json();
      if (result.status === 'success') {
        setFileList(result.data.files);
        setCurrentDir(result.data.current_dir);
        setParentDir(result.data.parent_dir);
      }
    } catch (err) {
      setError(err.message.includes('Failed to fetch') 
        ? '无法连接到后端服务，请检查服务器是否启动' 
        : err.message
      );
      console.error('获取文件列表失败:', err);
    } finally {
      setIsLoadingFiles(false);
    }
  };

  // 选择服务器文件
  const selectServerFile = async (file) => {
    setBackendFilePath(file.path);
    setShowFileBrowser(false);
    
    // 加载文件预览
    try {
      const response = await fetch(`${API_BASE}/file?path=${encodeURIComponent(file.path)}`);
      if (!response.ok) throw new Error('获取文件预览失败');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      
      // 设置文件信息
      setFileInfo({
        name: file.name,
        size: file.size_human,
        format: file.type === 'image' ? 'image/*' : 'video/*',
        type: file.type
      });
      
      // 获取媒体详细信息
      getMediaInfo(file.path, true);
    } catch (err) {
      setError(`文件预览失败: ${err.message}`);
    }
  };

  // 获取媒体文件信息
  const getMediaInfo = async (filePath, isOriginal = true) => {
    try {
      const response = await fetch(`${API_BASE}/media-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: filePath })
      });
      
      if (!response.ok) throw new Error('获取媒体信息失败');
      
      const info = await response.json();
      if (isOriginal) {
        setOriginalMediaInfo(info);
      } else {
        setProcessedMediaInfo(info);
      }
    } catch (err) {
      console.warn('获取媒体信息失败:', err);
    }
  };

  // 参数变更处理
  const handleParamChange = (key, value) => {
    if (!isTypeValid) return;
    
    const paramDef = DEGRADATION_TYPES[selectedType].params[key];
    let parsedValue = value;
    
    if (paramDef.type === 'int') {
      parsedValue = parseInt(value, 10);
      parsedValue = Math.max(paramDef.min, Math.min(paramDef.max, parsedValue));
    } else if (paramDef.type === 'float') {
      parsedValue = parseFloat(value);
      parsedValue = Math.max(paramDef.min, Math.min(paramDef.max, parsedValue));
    }
    
    setParams(prev => ({ ...prev, [key]: parsedValue }));
  };

  // 重置参数
  const handleResetParams = () => {
    if (!isTypeValid) return;
    
    const defaultParams = {};
    Object.entries(DEGRADATION_TYPES[selectedType].params).forEach(([key, param]) => {
      defaultParams[key] = param.default;
    });
    setParams(defaultParams);
  };

  // 获取处理后的文件
  const fetchProcessedFile = async (relativePath) => {
    try {
      const response = await fetch(`${API_BASE}/file?path=${encodeURIComponent(relativePath)}`, {
        method: 'GET',
      });
      if (!response.ok) throw new Error('获取处理结果失败');
      
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setProcessedBlob(blob);
      setProcessedUrl(url);
      
      // 获取处理后的媒体信息
      getMediaInfo(relativePath, false);
    } catch (err) {
      setError(`获取结果失败: ${err.message}`);
    }
  };

  // 处理文件
  const processFile = async () => {
    if (!backendFilePath) {
      setError("请先选择文件");
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    setSaveInfo(null);
    
    try {
      const response = await fetch(`${API_BASE}/single-degradation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          media_path: backendFilePath,
          media_type: fileInfo.type,
          degradation_type: selectedType,
          params: params
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`处理失败: ${response.status} - ${errorText}`);
      }
      
      const result = await response.json();
      if (result.status === 'success') {
        await fetchProcessedFile(result.data.processed_path);
        setSaveInfo({ fileId: result.data.processed_path });
        alert(`处理完成！文件路径: ${result.data.processed_path}`);
      }
      
    } catch (err) {
      setError(err.message.includes('Failed to fetch') 
        ? '无法连接到后端服务，请检查服务器是否启动' 
        : err.message
      );
    } finally {
      setIsProcessing(false);
    }
  };

  // 重置处理状态
  const resetProcessingState = () => {
    setError(null);
    setProcessedUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
    setProcessedBlob(null);
    setSaveInfo(null);
    setProcessedMediaInfo(null);
  };

  // 保存到服务器
  const saveToDataset = () => {
    if (!processedBlob) {
      setError('请先处理文件');
      return;
    }
    setError(null);
    alert('已保存到服务器！文件路径: ' + (saveInfo?.fileId || '未知'));
  };

  // 从服务器删除文件
  const deleteFromDataset = async () => {
    if (!saveInfo?.fileId) {
      setError('没有可删除的保存记录');
      return;
    }
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/files/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ file_path: saveInfo.fileId })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`删除失败: ${errorText}`);
      }
      resetProcessingState();
      setError('已从服务器删除');
    } catch (err) {
      setError(err.message.includes('Failed to fetch') 
        ? '无法连接到后端服务，请检查服务器是否启动' 
        : err.message
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // 下载文件
  const downloadFile = () => {
    if (processedUrl && backendFilePath) {
      const a = document.createElement('a');
      a.href = processedUrl;
      a.download = `processed_${selectedType}_${backendFilePath.split('/').pop()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // 格式化文件大小
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // 媒体信息展示组件
  const MediaInfoCard = ({ title, info, mediaType }) => {
    if (!info) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg text-gray-500 text-sm">
          <div className="flex items-center mb-2">
            <Info className="w-4 h-4 mr-1" />
            <span className="font-medium">{title}信息</span>
          </div>
          <p>加载中...</p>
        </div>
      );
    }

    return (
      <div className="bg-gray-50 p-4 rounded-lg text-sm">
        <div className="flex items-center mb-3">
          <Info className="w-4 h-4 mr-1 text-blue-500" />
          <span className="font-medium">{title}信息</span>
        </div>
        <ul className="space-y-1.5">
          <li className="flex justify-between">
            <span className="text-gray-600">分辨率:</span>
            <span>{info.width} × {info.height}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600">格式:</span>
            <span>{info.format || '未知'}</span>
          </li>
          {mediaType === 'video' && (
            <>
              <li className="flex justify-between">
                <span className="text-gray-600">时长:</span>
                <span>{formatDuration(info.duration)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">帧率:</span>
                <span>{info.fps ? `${info.fps.toFixed(2)} fps` : '未知'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">视频编码:</span>
                <span>{info.video_codec || '未知'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">音频编码:</span>
                <span>{info.audio_codec || '无'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">比特率:</span>
                <span>{formatBitrate(info.bitrate)}</span>
              </li>
            </>
          )}
          {mediaType === 'image' && (
            <>
              <li className="flex justify-between">
                <span className="text-gray-600">色彩模式:</span>
                <span>{info.color_space || '未知'}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">位深度:</span>
                <span>{info.bit_depth ? `${info.bit_depth} bit` : '未知'}</span>
              </li>
            </>
          )}
          <li className="flex justify-between">
            <span className="text-gray-600">文件大小:</span>
            <span>{info.file_size ? formatBytes(info.file_size) : fileInfo?.size}</span>
          </li>
        </ul>
      </div>
    );
  };

  // 文件浏览器组件
  const FileBrowser = () => (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${showFileBrowser ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
            服务器文件浏览
          </h3>
          <button
            onClick={() => setShowFileBrowser(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center">
            {parentDir !== currentDir && (
              <button
                onClick={() => fetchFileList(parentDir)}
                className="text-blue-600 hover:text-blue-800 mr-2"
              >
                <ChevronUp className="w-4 h-4" />
                <span className="text-sm ml-1">上级目录</span>
              </button>
            )}
            <span className="text-sm text-gray-600">当前目录: {BACKEND_FILE_ROOT}/{currentDir || '/'}</span>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {isLoadingFiles ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : fileList.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>当前目录没有可用的媒体文件</p>
              <p className="text-sm mt-2">请将文件放在服务器的 {BACKEND_FILE_ROOT} 目录下</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fileList.map((file) => (
                <div
                  key={file.path}
                  onClick={() => selectServerFile(file)}
                  className="border rounded-lg p-3 hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="flex justify-center mb-2">
                    {file.type === 'image' ? (
                      <Image className="w-12 h-12 text-green-500" />
                    ) : (
                      <Video className="w-12 h-12 text-purple-500" />
                    )}
                  </div>
                  <h4 className="font-medium text-sm truncate">{file.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{file.size_human}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-4 border-t flex justify-end">
          <button
            onClick={() => setShowFileBrowser(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto p-6">
        {/* 错误提示 */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6 flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* 退化类型描述 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center mb-4">
            <Settings className="w-6 h-6 text-blue-600 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800">
              {isTypeValid ? DEGRADATION_TYPES[selectedType].name : '未知处理'}
            </h2>
          </div>
          <p className="text-gray-600 leading-relaxed">
            {isTypeValid ? DEGRADATION_TYPES[selectedType].description : '未找到该处理类型的描述'}
            。通过调节参数，可以模拟真实场景下的退化效果，适用于算法验证、效果演示和技术研究等场景。
          </p>
        </div>

        {/* 文件选择区域 - 横向放在介绍下方 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <FolderOpen className="w-5 h-5 mr-2" />
            服务器文件选择
          </h3>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
            {!backendFilePath ? (
              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <div className="flex justify-center mb-4 md:mb-0">
                  <Image className="w-10 h-10 text-gray-400 mr-2" />
                  <Video className="w-10 h-10 text-gray-400" />
                </div>
                <div className="text-center md:text-left">
                  <p className="text-gray-600 mb-4">从服务器 {BACKEND_FILE_ROOT} 目录选择文件</p>
                  <button
                    onClick={() => {
                      setShowFileBrowser(true);
                      fetchFileList(currentDir); // 刷新文件列表
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors mb-3"
                  >
                    浏览服务器文件
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-left space-y-2 mb-4 md:mb-0">
                  <p className="font-medium">{backendFilePath}</p>
                  <p className="text-sm text-gray-600">路径: {BACKEND_FILE_ROOT}/{backendFilePath}</p>
                  <p className="text-sm text-gray-600">格式: {fileInfo?.format} | 大小: {fileInfo?.size}</p>
                </div>
                <button
                  onClick={() => {
                    setBackendFilePath('');
                    setPreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
                    setFileInfo(null);
                    setOriginalMediaInfo(null);
                    resetProcessingState();
                  }}
                  className="text-red-600 text-sm hover:underline"
                >
                  更换文件
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：参数调节区域（始终显示） */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">参数调节</h3>
                <button
                  onClick={handleResetParams}
                  disabled={!isTypeValid}
                  className={`text-gray-500 hover:text-gray-700 flex items-center text-sm ${!isTypeValid ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  重置
                </button>
              </div>

              {!isTypeValid ? (
                <div className="text-center py-8 text-gray-500">
                  <p>无效的退化类型，无法加载参数</p>
                </div>
              ) : !backendFilePath ? (
                <div className="mb-4 text-yellow-600 text-sm bg-yellow-50 p-3 rounded-lg">
                  <p>请先选择文件，参数调节将影响处理效果</p>
                </div>
              ) : null}

              <div className="space-y-4">
                {isTypeValid && Object.entries(DEGRADATION_TYPES[selectedType].params).map(([key, param]) => {
                  if (param.type === 'select') {
                    return (
                      <ParamSelect
                        key={key}
                        label={param.description}
                        value={params[key]}
                        options={param.options.map(option => ({
                          value: option,
                          label: option === 'nearest' ? '最近邻' :
                                 option === 'linear' ? '线性' :
                                 option === 'cubic' ? '三次方' :
                                 option === 'gaussian' ? '高斯噪声' :
                                 option === 'salt_pepper' ? '椒盐噪声' :
                                 option === 'poisson' ? '泊松噪声' : option
                        }))}
                        onChange={(value) => handleParamChange(key, value)}
                        disabled={!backendFilePath}
                      />
                    );
                  } else {
                    return (
                      <ParamSlider
                        key={key}
                        label={param.description}
                        value={params[key]}
                        min={param.min}
                        max={param.max}
                        step={param.type === 'float' ? 0.1 : 1}
                        onChange={(value) => handleParamChange(key, value)}
                        disabled={!backendFilePath}
                      />
                    );
                  }
                })}
              </div>

              {backendFilePath && isTypeValid && (
                <div className="mt-6 space-y-3">
                  <button
                    onClick={processFile}
                    disabled={isProcessing}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${isProcessing ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {isProcessing ? '处理中...' : '开始处理'}
                  </button>
                  <button
                    onClick={saveToDataset}
                    disabled={!processedBlob}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${!processedBlob ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
                  >
                    <Save className="w-4 h-4 inline mr-2" />
                    保存到服务器
                  </button>
                  <button
                    onClick={deleteFromDataset}
                    disabled={isDeleting || !saveInfo?.fileId}
                    className={`w-full py-2 rounded-lg font-medium transition-colors ${isDeleting || !saveInfo?.fileId ? 'bg-gray-400 text-gray-600 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700'}`}
                  >
                    <Trash2 className="w-4 h-4 inline mr-2" />
                    {isDeleting ? '删除中...' : '从服务器删除'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 右侧：结果与信息展示 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 处理结果 */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-6">处理结果</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {previewUrl && (
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">原始文件</h4>
                    <div className="relative">
                      {fileInfo?.type === 'image' ? (
                        <img 
                          src={previewUrl} 
                          alt="Original" 
                          className="w-full h-64 object-cover rounded-lg border" 
                          onLoad={(e) => {
                            if (!originalMediaInfo) {
                              setOriginalMediaInfo(prev => ({
                                ...prev,
                                width: e.target.naturalWidth,
                                height: e.target.naturalHeight
                              }));
                            }
                          }}
                        />
                      ) : fileInfo?.type === 'video' ? (
                        <video 
                          ref={originalVideoRef}
                          src={previewUrl} 
                          controls 
                          className="w-full h-64 object-cover rounded-lg border"
                          onLoadedMetadata={(e) => {
                            if (!originalMediaInfo) {
                              setOriginalMediaInfo(prev => ({
                                ...prev,
                                width: e.target.videoWidth,
                                height: e.target.videoHeight,
                                duration: e.target.duration,
                                fps: e.target.videoFrameRate
                              }));
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-100">
                          <p className="text-gray-500">不支持的文件类型</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {processedUrl && (
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-gray-800">处理结果</h4>
                      {fileInfo?.type === 'video' && (
                        <button
                          onClick={() => processedVideoRef.current?.load()}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          <RefreshCw className="w-3 h-3 inline mr-1" />
                          重载
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      {fileInfo?.type === 'image' ? (
                        <img
                          src={processedUrl}
                          alt="Processed"
                          className="w-full h-64 object-cover rounded-lg border"
                          onError={(e) => {
                            console.error('图像加载失败:', e);
                            setError('处理后的图像加载失败');
                          }}
                          onLoad={(e) => {
                            if (!processedMediaInfo) {
                              setProcessedMediaInfo(prev => ({
                                ...prev,
                                width: e.target.naturalWidth,
                                height: e.target.naturalHeight
                              }));
                            }
                          }}
                        />
                      ) : fileInfo?.type === 'video' ? (
                        <video
                          ref={processedVideoRef}
                          src={processedUrl}
                          controls
                          preload="metadata"
                          className="w-full h-64 object-cover rounded-lg border"
                          onError={(e) => {
                            console.error('视频加载失败:', e);
                            setError(`处理后的视频加载失败: ${e.target.error?.message || '未知错误'}`);
                          }}
                          onLoadedMetadata={(e) => {
                            if (!processedMediaInfo) {
                              setProcessedMediaInfo(prev => ({
                                ...prev,
                                width: e.target.videoWidth,
                                height: e.target.videoHeight,
                                duration: e.target.duration,
                                fps: e.target.videoFrameRate
                              }));
                            }
                          }}
                        />
                      ) : (
                        <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-100">
                          <p className="text-gray-500">不支持的文件类型</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <button
                        onClick={downloadFile}
                        className="w-full flex items-center justify-center px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        下载
                      </button>
                      {processedBlob && (
                        <p className="text-xs text-gray-500 text-center">文件大小: {formatBytes(processedBlob.size)}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              {!backendFilePath && (
                <div className="text-center py-12 text-gray-500">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>请先从服务器选择文件以进行处理</p>
                </div>
              )}
            </div>

            {/* 媒体信息对比 */}
            {backendFilePath && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-blue-600" />
                  媒体信息对比
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MediaInfoCard 
                    title="原始文件" 
                    info={originalMediaInfo} 
                    mediaType={fileInfo?.type} 
                  />
                  {processedUrl && (
                    <MediaInfoCard 
                      title="处理后文件" 
                      info={processedMediaInfo} 
                      mediaType={fileInfo?.type} 
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 文件浏览器弹窗 */}
      <FileBrowser />

      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          background: #e5e7eb;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
};

export default LocalVideoDegradationApp;
    

