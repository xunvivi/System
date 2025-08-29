// 格式化时间（秒转时分秒）
export const formatDuration = (seconds) => {
  if (!seconds || isNaN(seconds)) return '未知';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  return h > 0 ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}` : 
         `${m}:${s.toString().padStart(2, '0')}`;
};

// 格式化比特率
export const formatBitrate = (bitsPerSecond) => {
  if (!bitsPerSecond || isNaN(bitsPerSecond)) return '未知';
  if (bitsPerSecond >= 1000000) {
    return `${(bitsPerSecond / 1000000).toFixed(2)} Mbps`;
  } else if (bitsPerSecond >= 1000) {
    return `${(bitsPerSecond / 1000).toFixed(2)} Kbps`;
  }
  return `${bitsPerSecond} bps`;
};

// 格式化文件大小
export const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};