// FileBrowser.jsx
import React from 'react';
import { FolderOpen, ChevronUp, Image, Video } from 'lucide-react';

const FileBrowser = ({
  showFileBrowser,
  onClose,
  fileList,
  currentDir,
  parentDir,
  isLoadingFiles,
  onSelectFile,
  onNavigateDir,
  backendFileRoot
}) => {
  if (!showFileBrowser) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 transition-opacity duration-300 opacity-100">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] flex flex-col">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800 flex items-center">
            <FolderOpen className="w-5 h-5 mr-2 text-blue-600" />
            服务器文件浏览
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center">
            {parentDir !== currentDir && (
              <button
                onClick={() => onNavigateDir(parentDir)}
                className="text-blue-600 hover:text-blue-800 mr-2"
              >
                <ChevronUp className="w-4 h-4" />
                <span className="text-sm ml-1">上级目录</span>
              </button>
            )}
            <span className="text-sm text-gray-600">当前目录: {backendFileRoot}/{currentDir || '/'}</span>
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
              <p className="text-sm mt-2">请将文件放在服务器的 {backendFileRoot} 目录下</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {fileList.map((file) => (
                <div
                  key={file.path}
                  onClick={() => onSelectFile(file)}
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
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            取消
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileBrowser;