import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { formatFileSize, getFileInfo } from '../../utils/fileUtils';

// 修正异步创建文件预览的逻辑（不返回File对象）
export const createFilePreviewAsync = createAsyncThunk(
  'file/createPreview',
  async (file, { dispatch }) => {
    // 使用Promise封装FileReader，避免回调嵌套
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve({
          previewUrl: e.target.result,
          fileInfo: getFileInfo(file)
        });
      };
      reader.onerror = () => {
        reject(new Error('文件预览生成失败'));
      };
      reader.readAsDataURL(file);
    });
  }
);

const fileSlice = createSlice({
  name: 'file',
  initialState: {
    previewUrl: null,          // 预览URL（字符串，可序列化）
    processedUrl: null,        // 处理后文件URL
    fileInfo: null,            // 原始文件信息（普通对象）
    processedInfo: null,       // 处理后文件信息
    cleanupFunction: null,     // URL清理函数（注意：函数是非序列化的）
    error: null                // 文件相关错误
  },
  reducers: {
    // 移除setOriginalFile，不再存储File对象
    
    clearFile: (state) => {
      // 清理URL避免内存泄漏
      if (state.cleanupFunction) {
        state.cleanupFunction();
      }
      state.previewUrl = null;
      state.processedUrl = null;
      state.fileInfo = null;
      state.processedInfo = null;
      state.cleanupFunction = null;
      state.error = null;
    },
    setProcessedFile: (state, action) => {
      state.processedUrl = action.payload.url;
      state.processedInfo = {
        name: action.payload.name,
        size: formatFileSize(action.payload.size),
        type: action.payload.type,
        format: action.payload.type.split('/')[1]?.toUpperCase() || '未知'
      };
      // 注意：存储函数会触发非序列化警告，实际项目中建议改用其他清理方式
      state.cleanupFunction = action.payload.cleanup;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFilePreviewAsync.fulfilled, (state, action) => {
        state.previewUrl = action.payload.previewUrl;
        state.fileInfo = action.payload.fileInfo;
        state.error = null;
      })
      .addCase(createFilePreviewAsync.rejected, (state, action) => {
        state.error = '文件预览失败: ' + (action.error.message || '未知错误');
        state.previewUrl = null;
        state.fileInfo = null;
      });
  }
});

export const { clearFile, setProcessedFile } = fileSlice.actions;
export default fileSlice.reducer;