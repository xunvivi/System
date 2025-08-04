// src/utils/api.js
const API_BASE_URL = "http://localhost:8000/api"; // 后端服务地址

// 文件上传
export const uploadFile = async (file) => {
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
export const processCompositeDegradation = async (params) => {
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
export const getMediaInfo = async (filePath) => {
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

// 获取文件访问URL（通过后端接口访问文件）
export const getFileUrl = (filePath) => {
  return `${API_BASE_URL}/file?path=${encodeURIComponent(filePath)}`;
};