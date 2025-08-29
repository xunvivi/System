import React from 'react';
import { Image, Trash2, Upload, Video } from 'lucide-react';

const FileUploader = ({ 
  file, 
  fileType, 
  fileInputRef, 
  mediaInfo, 
  onFileUpload, 
  onRemoveFile, 
  isProcessing 
}) => {
  return (
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
          onChange={onFileUpload}
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
                onClick={onRemoveFile}
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
  );
};

export default FileUploader;