import axios from 'axios';

// 后端API基础地址
const API_BASE_URL = 'http://localhost:5000/api';

/**
 * 安全获取数组，避免 undefined 或 null
 */
const safeArray = (value) => {
  if (!value || !Array.isArray(value)) {
    return [];
  }
  return value;
};

/**
 * 安全获取对象，避免 undefined 或 null
 */
const safeObject = (value) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return value;
};

/**
 * 获取所有支持的退化类型及其参数配置
 * @returns {Promise<Object>} 退化类型配置
 */
export const getDegradationTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/types`);
    return safeObject(response.data);
  } catch (error) {
    console.error('获取退化类型失败:', error);
    throw new Error('获取退化类型失败，请稍后重试');
  }
};

/**
 * 处理文件并应用退化效果
 * @param {File} file - 要处理的文件
 * @param {string} degradationType - 退化类型
 * @param {Object} params - 退化参数
 * @param {Function} onProgress - 进度回调函数
 * @returns {Promise<Object>} 处理结果
 */
export const processFile = async (file, degradationType, params, onProgress) => {
  try {
    // 参数基础验证
    if (!file) {
      throw new Error('请选择要处理的文件');
    }
    if (!degradationType) {
      throw new Error('请选择退化类型');
    }
    
    // 验证文件类型（根据后端支持的视频格式）
    const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/mkv', 'video/webm'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp4|avi|mov|mkv|webm)$/i)) {
      throw new Error('不支持的文件格式，请选择视频文件（MP4, AVI, MOV, MKV, WebM）');
    }
    
    // 文件大小限制（例如：500MB）
    const maxSize = 500 * 1024 * 1024; // 500MB
    if (file.size > maxSize) {
      throw new Error('文件过大，请选择小于500MB的文件');
    }
    
    // 参数验证
    const typeConfig = await getDegradationTypes();
    let validationResult;
    
    try {
      validationResult = await validateParams(degradationType, safeObject(params), typeConfig);
    } catch (validationError) {
      throw new Error(`参数验证失败: ${validationError.message}`);
    }

    const safeValidationResult = safeObject(validationResult);
    const errors = safeArray(safeValidationResult.errors || []);
    
    if (!safeValidationResult.valid) {
      const errorMessage = errors.length > 0 
        ? errors.join('; ') 
        : '参数不符合要求，请检查配置';
      throw new Error(`参数错误: ${errorMessage}`);
    }

    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);
    formData.append('degradationType', degradationType);
    formData.append('params', JSON.stringify(safeObject(params)));
    
    // 发送请求
    const response = await axios.post(`${API_BASE_URL}/process`, formData, {
      responseType: 'blob',
      timeout: 300000, // 5分钟超时，视频处理可能需要较长时间
      onUploadProgress: (progressEvent) => {
        if (progressEvent && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
          if (typeof onProgress === 'function') {
            onProgress(percent);
          }
        }
      }
    });
    
    // 安全处理响应头
    const headers = safeObject(response.headers);
    const fileName = headers['x-filename'] || `processed-${degradationType}-${file.name}`;
    const fileSize = headers['x-filesize'];
    const fileType = headers['x-filetype'] || 'video/mp4';
    const fileUrl = URL.createObjectURL(new Blob([response.data], { type: fileType }));
    
    return {
      url: fileUrl,
      name: fileName,
      size: fileSize ? parseInt(fileSize) : response.data.size,
      type: fileType,
      cleanup: () => URL.revokeObjectURL(fileUrl)
    };
  } catch (error) {
    console.error('文件处理失败:', error);
    
    // 根据错误类型提供更详细的错误信息
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('处理超时，请尝试处理较小的文件或简化参数设置');
    }
    
    if (error.response) {
      // 服务器返回错误
      const status = error.response.status;
      const data = error.response.data;
      
      if (status === 400) {
        throw new Error(data.detail || '请求参数错误');
      } else if (status === 413) {
        throw new Error('文件过大，请选择较小的文件');
      } else if (status === 422) {
        throw new Error('文件格式不支持或参数格式错误');
      } else if (status >= 500) {
        throw new Error('服务器处理错误，请稍后重试');
      }
    }
    
    const errorMsg = error.message || '文件处理失败，请稍后重试';
    throw new Error(errorMsg);
  }
};

/**
 * 生成退化效果预览
 * @param {string} degradationType - 退化类型
 * @param {Object} params - 退化参数
 * @returns {Promise<Object>} 预览结果
 */
export const generatePreview = async (degradationType, params) => {
  try {
    // 基础验证
    if (!degradationType) {
      throw new Error('请选择退化类型');
    }
    
    // 参数验证
    const typeConfig = await getDegradationTypes();
    let validationResult;
    
    try {
      validationResult = await validateParams(degradationType, safeObject(params), typeConfig);
    } catch (validationError) {
      throw new Error(`参数验证失败: ${validationError.message}`);
    }

    const safeValidationResult = safeObject(validationResult);
    const errors = safeArray(safeValidationResult.errors || []);
    
    if (!safeValidationResult.valid) {
      const errorMessage = errors.length > 0 
        ? errors.join('; ') 
        : '参数不符合要求，请检查配置';
      throw new Error(`参数错误: ${errorMessage}`);
    }

    const response = await axios.post(
      `${API_BASE_URL}/preview`,
      { 
        degradationType, 
        params: safeObject(params) 
      },
      { 
        responseType: 'blob',
        timeout: 30000 // 30秒超时
      }
    );
    
    const previewUrl = URL.createObjectURL(response.data);
    
    return {
      url: previewUrl,
      cleanup: () => URL.revokeObjectURL(previewUrl)
    };
  } catch (error) {
    console.error('生成预览失败:', error);
    
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      throw new Error('预览生成超时，请稍后重试');
    }
    
    if (error.response && error.response.status >= 500) {
      throw new Error('服务器错误，预览生成失败');
    }
    
    throw new Error(error.message || '生成预览失败，请稍后重试');
  }
};

/**
 * 验证参数是否符合要求
 * @param {string} degradationType - 退化类型
 * @param {Object} params - 要验证的参数
 * @param {Object} [typeConfig] - 退化类型配置
 * @returns {Promise<Object>} 验证结果 { valid: boolean, errors: Array<string> }
 */
export const validateParams = async (degradationType, params, typeConfig) => {
  // 强制初始化为空数组，从根源避免undefined
  let errors = [];
  
  try {
    // 基础参数验证
    if (!degradationType || typeof degradationType !== 'string') {
      errors.push('退化类型不能为空');
      return { valid: false, errors };
    }
    
    // 安全获取参数对象
    const safeParams = safeObject(params);
    
    // 安全获取配置
    let config = safeObject(typeConfig);
    if (Object.keys(config).length === 0) {
      try {
        config = await getDegradationTypes();
        config = safeObject(config);
      } catch (error) {
        errors.push('无法获取参数配置，请检查网络连接');
        return { valid: false, errors };
      }
    }
    
    // 验证退化类型是否存在
    if (!config[degradationType]) {
      errors.push(`不支持的退化类型: ${degradationType}`);
      return { valid: false, errors };
    }
    
    // 安全获取参数配置
    const typeSpecificConfig = safeObject(config[degradationType]);
    const paramConfig = safeObject(typeSpecificConfig.params);
    
    if (Object.keys(paramConfig).length === 0) {
      return { valid: true, errors }; // 无参数配置，验证通过
    }
    
    // 验证每个参数
    Object.entries(paramConfig).forEach(([paramName, configDetails]) => {
      const value = safeParams[paramName];
      const safeConfigDetails = safeObject(configDetails);
      
      // 检查必需参数
      if (value === undefined || value === null) {
        errors.push(`缺少必需参数: ${paramName}`);
        return;
      }
      
      // 类型验证
      switch (safeConfigDetails.type) {
        case 'int':
        case 'integer': {
          const numValue = Number(value);
          if (isNaN(numValue) || !Number.isInteger(numValue)) {
            errors.push(`参数 ${paramName} 必须是整数`);
          } else {
            if (safeConfigDetails.min !== undefined && numValue < safeConfigDetails.min) {
              errors.push(`参数 ${paramName} 不能小于 ${safeConfigDetails.min}`);
            }
            if (safeConfigDetails.max !== undefined && numValue > safeConfigDetails.max) {
              errors.push(`参数 ${paramName} 不能大于 ${safeConfigDetails.max}`);
            }
            // 特殊验证：kernel_size必须是奇数
            if (paramName === 'kernel_size' && numValue % 2 === 0) {
              errors.push(`参数 ${paramName} 必须是奇数`);
            }
          }
          break;
        }
        
        case 'float':
        case 'number': {
          const numValue = Number(value);
          if (isNaN(numValue)) {
            errors.push(`参数 ${paramName} 必须是数字`);
          } else {
            if (safeConfigDetails.min !== undefined && numValue < safeConfigDetails.min) {
              errors.push(`参数 ${paramName} 不能小于 ${safeConfigDetails.min}`);
            }
            if (safeConfigDetails.max !== undefined && numValue > safeConfigDetails.max) {
              errors.push(`参数 ${paramName} 不能大于 ${safeConfigDetails.max}`);
            }
          }
          break;
        }
        
        case 'select':
        case 'enum': {
          const options = safeArray(safeConfigDetails.options);
          if (options.length === 0) {
            errors.push(`参数 ${paramName} 缺少可选项配置`);
          } else if (!options.includes(value)) {
            errors.push(`参数 ${paramName} 必须是以下选项之一: ${options.join(', ')}`);
          }
          break;
        }
          
        case 'boolean': {
          if (typeof value !== 'boolean') {
            errors.push(`参数 ${paramName} 必须是布尔值 (true/false)`);
          }
          break;
        }
          
        default: {
          // 对于未知类型，检查是否有默认值
          if (safeConfigDetails.default !== undefined) {
            console.warn(`未知参数类型 ${safeConfigDetails.type}，使用默认值`);
          }
          break;
        }
      }
    });
    
    // 确保返回的errors始终是数组
    return { valid: errors.length === 0, errors: safeArray(errors) };
  } catch (error) {
    console.error('参数验证失败:', error);
    // 确保errors是数组
    if (!Array.isArray(errors)) {
      errors = [];
    }
    errors.push('参数验证过程出错');
    return { valid: false, errors };
  }
};

/**
 * 获取参数的默认值
 * @param {string} degradationType - 退化类型
 * @returns {Promise<Object>} 默认参数对象
 */
export const getDefaultParams = async (degradationType) => {
  try {
    const typeConfig = await getDegradationTypes();
    const config = safeObject(typeConfig);
    
    if (!config[degradationType]) {
      throw new Error(`不支持的退化类型: ${degradationType}`);
    }
    
    const typeSpecificConfig = safeObject(config[degradationType]);
    const paramConfig = safeObject(typeSpecificConfig.params);
    const defaultParams = {};
    
    Object.entries(paramConfig).forEach(([paramName, configDetails]) => {
      const safeConfigDetails = safeObject(configDetails);
      if (safeConfigDetails.default !== undefined) {
        defaultParams[paramName] = safeConfigDetails.default;
      }
    });
    
    return defaultParams;
  } catch (error) {
    console.error('获取默认参数失败:', error);
    throw error;
  }
};

/**
 * 检查服务器健康状态
 * @returns {Promise<boolean>} 服务器是否健康
 */
export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL.replace('/api', '')}/health`, {
      timeout: 5000
    });
    return response.data.status === 'healthy';
  } catch (error) {
    console.error('健康检查失败:', error);
    return false;
  }
};

/**
 * 格式化文件大小
 * @param {number} bytes - 字节数
 * @returns {string} 格式化后的文件大小
 */
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

/**
 * 获取退化类型的显示名称
 * @param {string} degradationType - 退化类型key
 * @param {Object} [typeConfig] - 退化类型配置
 * @returns {Promise<string>} 显示名称
 */
export const getDegradationDisplayName = async (degradationType, typeConfig) => {
  try {
    let config = safeObject(typeConfig);
    if (Object.keys(config).length === 0) {
      config = await getDegradationTypes();
      config = safeObject(config);
    }
    
    const typeInfo = safeObject(config[degradationType]);
    return typeInfo.name || degradationType;
  } catch (error) {
    console.error('获取显示名称失败:', error);
    return degradationType;
  }
};

/**
 * 获取退化类型的描述
 * @param {string} degradationType - 退化类型key  
 * @param {Object} [typeConfig] - 退化类型配置
 * @returns {Promise<string>} 描述信息
 */
export const getDegradationDescription = async (degradationType, typeConfig) => {
  try {
    let config = safeObject(typeConfig);
    if (Object.keys(config).length === 0) {
      config = await getDegradationTypes();
      config = safeObject(config);
    }
    
    const typeInfo = safeObject(config[degradationType]);
    return typeInfo.description || '';
  } catch (error) {
    console.error('获取描述失败:', error);
    return '';
  }
};