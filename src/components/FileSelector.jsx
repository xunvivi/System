import React from 'react';
import { FolderOpen } from 'lucide-react';

const FileSelector = ({
  backendFilePath,
  fileInfo,
  backendFileRoot,
  onBrowse,
  onChangeFile
}) => {
  return (
    <div className="media-upload">
        {!backendFilePath ? (
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <div className="text-center md:text-left">
              <i className="fas fa-cloud-upload-alt" style={{fontSize: '1.5rem', marginBottom: '8px'}}></i>
                <p className="text-gray-600 mb-2 text-sm">从服务器 {backendFileRoot} 目录选择文件</p>
                <p className="text-sm">点击或拖放图像/视频文件到此处</p>
                <p className="small text-xs text-gray-500 mt-1">支持格式: JPG, PNG, MP4, MOV</p>
              <button
                onClick={onBrowse}
                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors mb-2 text-sm mt-2"
              >
                浏览服务器文件
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-left space-y-1 mb-3 md:mb-0">
              <p className="font-medium text-sm">{backendFilePath}</p>
              <p className="text-xs text-gray-600">路径: {backendFileRoot}/{backendFilePath}</p>
              <p className="text-xs text-gray-600">格式: {fileInfo?.format} | 大小: {fileInfo?.size}</p>
            </div>
            <button
              onClick={onChangeFile}
              className="text-red-600 text-xs hover:underline"
            >
              更换文件
            </button>
          </div>
        )}
      </div>
  );
};

export default FileSelector;