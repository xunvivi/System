import React from 'react';
import { Info } from 'lucide-react';
import { formatDuration, formatBitrate, formatBytes } from '../utils/formatters';

const MediaInfoCard = ({ title, info, mediaType }) => {
  // 处理空值的工具函数（统一兜底）
  const getValue = (value, fallback = '未知') => 
    value == null || value === '' ? fallback : value;

  if (!info) {
    return (
      <div className="bg-gray-900 p-4 rounded-lg text-gray-400 text-sm border border-gray-800">
        <div className="flex items-center mb-2">
          <Info className="w-4 h-4 mr-1 text-blue-400" />
          <span className="font-medium">{title}信息</span>
        </div>
        <p>加载中...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg text-sm border border-gray-800">
      <div className="flex items-center mb-3">
        <Info className="w-4 h-4 mr-1 text-blue-400" />
        <span className="font-medium text-white">{title}信息</span>
      </div>
      <ul className="space-y-1.5">
        {/* 分辨率 */}
        <li className="flex justify-between">
          <span className="text-gray-400">分辨率:</span>
          <span className="text-white">
            {getValue(info.width)} × {getValue(info.height)}
          </span>
        </li>

        {/* 格式 */}
        <li className="flex justify-between">
          <span className="text-gray-400">格式:</span>
          <span className="text-white">{getValue(info.format)}</span>
        </li>

        {/* 视频专属信息 */}
        {mediaType === 'video' && (
          <>
            <li className="flex justify-between">
              <span className="text-gray-400">时长:</span>
              <span className="text-white">
                {info.duration ? formatDuration(info.duration) : '未知'}
              </span>
            </li>

            <li className="flex justify-between">
              <span className="text-gray-400">帧率:</span>
              <span className="text-white">
                {info.fps ? `${info.fps.toFixed(2)} fps` : '未知'}
              </span>
            </li>

            <li className="flex justify-between">
              <span className="text-gray-400">视频编码:</span>
              <span className="text-white">{getValue(info.video_codec)}</span>
            </li>

            <li className="flex justify-between">
              <span className="text-gray-400">音频编码:</span>
              <span className="text-white">{getValue(info.audio_codec, '无')}</span>
            </li>

            <li className="flex justify-between">
              <span className="text-gray-400">比特率:</span>
              <span className="text-white">
                {info.bitrate ? formatBitrate(info.bitrate) : '未知'}
              </span>
            </li>
          </>
        )}

        {/* 图像专属信息 */}
        {mediaType === 'image' && (
          <>
            <li className="flex justify-between">
              <span className="text-gray-400">色彩模式:</span>
              <span className="text-white">{getValue(info.color_space)}</span>
            </li>

            <li className="flex justify-between">
              <span className="text-gray-400">位深度:</span>
              <span className="text-white">
                {info.bit_depth ? `${info.bit_depth} bit` : '未知'}
              </span>
            </li>
          </>
        )}

        {/* 文件大小（统一处理） */}
        <li className="flex justify-between">
          <span className="text-gray-400">文件大小:</span>
          <span className="text-white">
            {info.file_size ? formatBytes(info.file_size) : '未知'}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default MediaInfoCard;