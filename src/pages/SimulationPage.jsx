import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Download, Settings, Image, Video, Eye } from 'lucide-react';
import { DEGRADATION_TYPES } from '../data/DEGRADATION_TYPES';

// 导入抽离的组件
import ErrorAlert from '../components/ErrorAlert';
import MediaInfoCard from '../components/MediaInfoCard';
import FileBrowser from '../components/FileBrowser';
import ParamControlPanel from '../components/ParamControlPanel';
import MediaPreview from '../components/MediaPreview';
import ActionButtonGroup from '../components/ActionButtonGroup';
import FileSelector from '../components/FileSelector';

// 导入工具函数
import { formatDuration, formatBitrate, formatBytes } from '../utils/formatters';

// 后端API地址（对应file目录结构）
const API_BASE = 'http://localhost:8000/api';
const BACKEND_FILE_ROOT = 'file';

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
  
  // 初始化参数
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

  return (
    <div className="container">
      {/* 错误提示 */}
      <ErrorAlert 
        message={error} 
        onClose={() => setError(null)} 
      />

      {/* 退化类型描述 */}
      <div className="page-title">
        <i className="fas fa-blur"></i> 
        <h1>
          {isTypeValid ? DEGRADATION_TYPES[selectedType].name+'降质问题处理': '未知处理'}
        </h1>
        <p>
          {isTypeValid ? DEGRADATION_TYPES[selectedType].description : '未找到该处理类型的描述'}
          这里是简介，在data/DEGRADATION_TYPES的对应description里修改。
        </p>
      </div>

      {/* 文件选择区域 */}
      <FileSelector
        backendFilePath={backendFilePath}
        fileInfo={fileInfo}
        backendFileRoot={BACKEND_FILE_ROOT}
        onBrowse={() => {
          setShowFileBrowser(true);
          fetchFileList(currentDir);
        }}
        onChangeFile={() => {
          setBackendFilePath('');
          setPreviewUrl(prev => { if (prev) URL.revokeObjectURL(prev); return null; });
          setFileInfo(null);
          setOriginalMediaInfo(null);
          resetProcessingState();
        }}
      />

      <div className="content-wrapper">
        {/* 左侧：参数调节区域 */}
        <div className="control-panel">
          
          <ParamControlPanel
            degradationType={isTypeValid ? DEGRADATION_TYPES[selectedType] : null}
            params={params}
            onParamChange={handleParamChange}
            onResetParams={handleResetParams}
            isDisabled={!backendFilePath}
          />

          {backendFilePath && isTypeValid && (
            <div className="preview-controls">
              <ActionButtonGroup
                isProcessing={isProcessing}
                onProcess={processFile}
                onSave={saveToDataset}
                onDelete={deleteFromDataset}
                isDeleting={isDeleting}
                canSave={!!processedBlob}
                canDelete={!!saveInfo?.fileId}
              />
            </div>
          )}
        </div>

        {/* 右侧：结果与信息展示 */}
        <div className="preview-section">
          {/* 处理结果 */}
          <div>
            <h2 className="section-title">
              <i className="fas fa-eye"></i>
              处理结果
            </h2>
            <div className="preview-container">
              <div className="preview-box">
                <div className="preview-label">原始文件</div>
                <MediaPreview
                  url={previewUrl}
                  mediaType={fileInfo?.type}
                />
              </div>
              
              {processedUrl && (
                <div className="preview-box">
                  <div className="preview-label">处理结果</div>
                  <MediaPreview
                    url={processedUrl}
                    mediaType={fileInfo?.type}
                    isProcessed={true}
                    onReload={() => processedVideoRef.current?.load()}
                  />
                  <div style={{marginTop: '6px', textAlign: 'center'}}>
                     {processedBlob && null} 
                  </div>
                </div>
              )}
            </div>
            
            {!backendFilePath && (
              <div className="media-upload">
                <Video style={{fontSize: '2rem', marginBottom: '10px', color: 'var(--accent)'}} />
                <p>请先从服务器选择文件以进行处理</p>
              </div>
            )}
          </div>

          {/* 媒体信息对比 */}
          {backendFilePath && (
            <div className="blur-info">
              <h3 className="section-title">
                <i className="fas fa-info-circle"></i>
                媒体信息对比
              </h3>
              <div className="info-grid">
                <div className="info-card">
                  <h4>
                    <i className="fas fa-file"></i>
                    原始文件
                  </h4>
                  <MediaInfoCard 
                    info={originalMediaInfo} 
                    mediaType={fileInfo?.type} 
                  />
                </div>
                {processedUrl && (
                  <div className="info-card">
                    <h4>
                      <i className="fas fa-file-check"></i>
                      处理后文件
                    </h4>
                    <MediaInfoCard 
                      info={processedMediaInfo} 
                      mediaType={fileInfo?.type} 
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 文件浏览器弹窗 */}
      <FileBrowser
        showFileBrowser={showFileBrowser}
        onClose={() => setShowFileBrowser(false)}
        fileList={fileList}
        currentDir={currentDir}
        parentDir={parentDir}
        isLoadingFiles={isLoadingFiles}
        onSelectFile={selectServerFile}
        onNavigateDir={fetchFileList}
        backendFileRoot={BACKEND_FILE_ROOT}
      />

      <style jsx>{`
        :root {
            --primary: #0a1128;
            --secondary: #1c3a6f;
            --accent: #00e5ff;
            --accent2: #ff2a6d;
            --light: #eef0f7;
            --dark: #050a1a;
            --gradient: linear-gradient(135deg, var(--accent), #00c8ff);
            --gradient2: linear-gradient(135deg, var(--accent2), #ff5e94);
            --card-bg: rgba(10, 17, 40, 0.8);
        }
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            background: var(--dark);
            color: var(--light);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            min-height: 100vh;
            overflow-x: hidden;
            line-height: 1.2;
            font-size: 0.4rem;
        }
        
        body::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: 
                radial-gradient(circle at 10% 20%, rgba(28, 58, 111, 0.2) 0%, transparent 15%),
                radial-gradient(circle at 90% 80%, rgba(0, 229, 255, 0.1) 0%, transparent 20%),
                radial-gradient(circle at 50% 50%, rgba(255, 42, 109, 0.05) 0%, transparent 25%);
            z-index: -1;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 15px;
        }
        
        header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 0;
            position: relative;
            z-index: 10;
            border-bottom: 1px solid rgba(0, 229, 255, 0.1);
        }
        
        .logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .logo-icon {
            background: var(--gradient);
            width: 45px;
            height: 45px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 3px 15px rgba(0, 229, 255, 0.3);
        }
        
        .logo-text {
            font-size: 1.2rem;
            font-weight: 700;
            background: linear-gradient(to right, var(--accent), #ffffff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .page-title {
            text-align: center;
            margin: 25px 0;
        }
        
        .page-title h1 {
            font-size: 1.8rem;
            margin-bottom: 10px;
            background: linear-gradient(to right, var(--accent), #ffffff);
            -webkit-background-clip: text;
            background-clip: text;
            color: transparent;
        }
        
        .page-title p {
            font-size: 0.9rem;
            color: #a0b3d6;
            max-width: 800px;
            margin: 0 auto;
        }
        
.content-wrapper {
    display: flex;
    gap: 12px;  /* 减小左右区域间距 */
    margin: 15px 0;  /* 减小上下外边距 */
}

.control-panel {
    flex: 0 0 240px;  /* 固定较小宽度 */
    background: var(--card-bg);
    border: 1px solid rgba(0, 229, 255, 0.2);
    border-radius: 10px;  /* 减小圆角 */
    padding: 12px;  /* 大幅减小内边距 */
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);  /* 减小阴影 */
}

.preview-controls {
    /* 按钮区域与参数面板的分隔样式 */
}
        
        .preview-section {
            flex: 2;
            background: var(--card-bg);
            border: 1px solid rgba(0, 229, 255, 0.2);
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
            display: flex;
            flex-direction: column;
        }
        
        .section-title {
            font-size: 1.3rem;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 8px;
            color: var(--accent);
        }
        
        .section-title i {
            background: var(--gradient);
            width: 35px;
            height: 35px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
        }
        
        .param-group {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .param-title {
            font-size: 1rem;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .slider-container {
            margin: 15px 0;
        }
        
        .slider-label {
            display: flex;
            justify-content: space-between;
            margin-bottom: 6px;
        }
        
        .slider-label span {
            font-size: 0.8rem;
            color: #a0b3d6;
        }
        
        input[type="range"] {
            width: 100%;
            height: 6px;
            -webkit-appearance: none;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
            outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 16px;
            height: 16px;
            background: var(--gradient);
            border-radius: 50%;
            cursor: pointer;
            border: 1px solid var(--dark);
        }
        
        .radio-group {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin-top: 12px;
        }
        
        .radio-item {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid rgba(0, 229, 255, 0.1);
            border-radius: 8px;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 0.85rem;
        }
        
        .radio-item:hover {
            background: rgba(0, 229, 255, 0.1);
            border-color: var(--accent);
        }
        
        .radio-item.active {
            background: rgba(0, 229, 255, 0.15);
            border-color: var(--accent);
            box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
        }
        
        .media-upload {
            background: rgba(0, 0, 0, 0.3);
            border: 2px dashed rgba(0, 229, 255, 0.3);
            border-radius: 12px;
            padding: 20px;
            text-align: center;
            margin: 15px 0;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .media-upload:hover {
            border-color: var(--accent);
            background: rgba(0, 229, 255, 0.05);
        }
        
        .media-upload i {
            font-size: 2rem;
            margin-bottom: 10px;
            color: var(--accent);
        }
        
        .preview-container {
            display: flex;
            gap: 15px;
            margin: 15px 0;
            flex: 1;
        }
        
        .preview-box {
            flex: 1;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 220px;
            position: relative;
        }
        
        .preview-box img, .preview-box video {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        
        .preview-label {
            text-align: center;
            padding: 6px;
            background: rgba(0, 0, 0, 0.5);
            font-size: 0.9rem;
            width: 100%;
            position: absolute;
            bottom: 0;
            left: 0;
        }
        
        .preview-controls {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 20px;
        }
        
        .btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: var(--gradient);
            color: var(--dark);
            padding: 10px 20px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.9rem;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            box-shadow: 0 3px 15px rgba(0, 229, 255, 0.3);
            gap: 8px;
            width: 100%;
        }
        
        .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 20px rgba(0, 229, 255, 0.5);
        }
        
        .btn-outline {
            background: transparent;
            border: 1.5px solid var(--accent);
            color: var(--accent);
            box-shadow: 0 3px 15px rgba(0, 229, 255, 0.1);
        }
        
        .btn-outline:hover {
            background: rgba(0, 229, 255, 0.1);
        }
        
        .blur-info {
            background: rgba(0, 0, 0, 0.3);
            border-left: 3px solid var(--accent);
            padding: 15px;
            border-radius: 0 8px 8px 0;
            margin: 20px 0;
        }
        
        .blur-info h3 {
            color: var(--accent);
            margin-bottom: 10px;
        }
        
        .blur-info p {
            margin-bottom: 8px;
            color: #a0b3d6;
            font-size: 0.85rem;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin-top: 15px;
        }
        
        .info-card {
    background: rgba(0, 0, 0, 0.2);
    padding: 12px;
    border-radius: 8px;
    /* 去掉信息卡片边框（按需） */
    /* border: 1px solid rgba(0, 229, 255, 0.1); */ 
}
        
        .info-card h4 {
            color: var(--accent);
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 0.95rem;
        }
        
        @media (max-width: 992px) {
            .content-wrapper {
                flex-direction: column;
            }
            
            .preview-container {
                flex-direction: column;
                min-height: auto;
            }
        }
        
        @media (max-width: 768px) {
            .radio-group {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .info-grid {
                grid-template-columns: 1fr;
            }
            
            .page-title h1 {
                font-size: 1.5rem;
            }

        /* 在你的 style jsx 里追加 */
.control-panel {
    flex: 0 0 240px;  
    background: var(--card-bg);
    /* 去掉外边框 */
    /* border: 1px solid rgba(0, 229, 255, 0.2); */ 
    border-radius: 10px;  
    padding: 12px;  
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);  
}

.param-group {
    margin-bottom: 20px;
    padding-bottom: 15px;
    /* 去掉参数组底部分隔线 */
    /* border-bottom: 1px solid rgba(255, 255, 255, 0.1); */ 
}

.slider-container {
  /* 滑块容器单独控制间距 */
  display: flex;
  flex-direction: column;
  gap: 8px; 
}

.slider-label {
  /* 确保标签和滑块不重叠 */
  display: flex;
  justify-content: space-between;
  align-items: center;
}
        }
      `}</style>
    </div>
  );
};

export default LocalVideoDegradationApp;
    

