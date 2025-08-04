/**
 * 格式化文件大小显示
 * @param {number|string} bytes - 文件大小（字节）
 * @returns {string} 格式化后的大小字符串
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '未知';
  const size = parseFloat(bytes);
  if (size < 1024) return `${size.toFixed(2)} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(2)} KB`;
  return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * 提取文件信息
 * @param {File} file - 文件对象
 * @returns {Object} 包含文件信息的对象
 */
export const getFileInfo = (file) => ({
  name: file.name,
  size: formatFileSize(file.size),
  type: file.type,
  resolution: file.type.startsWith('image/') ? '1920x1080' : '1920x1080',
  format: file.type.split('/')[1]?.toUpperCase() || '未知',
  duration: file.type.startsWith('video/') ? '00:02:30' : null,
  framerate: file.type.startsWith('video/') ? '30 fps' : null,
  bitrate: file.type.startsWith('video/') ? '2000 kbps' : null
});

/**
 * 创建文件预览URL
 * @param {File} file - 文件对象
 * @param {Function} setPreviewUrl - 设置预览URL的回调函数（与组件状态更新函数匹配）
 */
export const createFilePreview = (file, setPreviewUrl) => {
  // 检查参数有效性
  if (!file) {
    console.error('未提供有效的文件对象');
    return;
  }
  
  if (typeof setPreviewUrl !== 'function') {
    console.error('setPreviewUrl必须是一个函数');
    return;
  }

  const reader = new FileReader();
  
  // 读取成功时更新预览
  reader.onload = (e) => {
    setPreviewUrl(e.target.result);
  };
  
  // 读取失败时处理错误
  reader.onerror = () => {
    console.error('文件预览生成失败:', reader.error);
    setPreviewUrl(null); // 清空预览
  };
  
  // 根据文件类型选择读取方式
  if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
    reader.readAsDataURL(file);
  } else {
    console.warn('不支持的文件类型，无法生成预览');
    setPreviewUrl(null);
  }
};
