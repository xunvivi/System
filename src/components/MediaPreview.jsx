// MediaPreview.jsx
import React, { useRef } from 'react';
import { RefreshCw } from 'lucide-react';

const MediaPreview = ({
  title,
  url,
  mediaType,
  isProcessed = false,
  onReload
}) => {
  const mediaRef = useRef(null);

  if (!url) return null;

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-gray-800">{title}</h4>
        {isProcessed && mediaType === 'video' && (
          <button
            onClick={() => {
              mediaRef.current?.load();
              if (onReload) onReload();
            }}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            <RefreshCw className="w-3 h-3 inline mr-1" />
            重载
          </button>
        )}
      </div>
      <div className="relative">
        {mediaType === 'image' ? (
          <img
            src={url}
            alt={title}
            className="w-full h-64 object-cover rounded-lg border"
            onError={(e) => console.error(`${title}加载失败:`, e)}
          />
        ) : mediaType === 'video' ? (
          <video
            ref={mediaRef}
            src={url}
            controls
            preload="metadata"
            className="w-full h-64 object-cover rounded-lg border"
            onError={(e) => console.error(`${title}加载失败:`, e)}
          />
        ) : (
          <div className="w-full h-64 flex items-center justify-center border rounded-lg bg-gray-100">
            <p className="text-gray-500">不支持的文件类型</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPreview;