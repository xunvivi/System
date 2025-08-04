import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { processFile, validateParams, getDegradationTypes } from '../../services/degradationService';

// 异步获取退化类型配置
export const fetchDegradationTypes = createAsyncThunk(
  'processing/fetchTypes',
  async () => {
    return await getDegradationTypes();
  }
);

// 异步处理文件
export const processFileAsync = createAsyncThunk(
  'processing/processFile',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const { originalFile } = state.file;
    const { currentType } = state.processing;
    const params = state.params[currentType] || {};
    const typesConfig = state.processing.types;

    // 验证参数
    const { valid, errors } = validateParams(currentType, params, typesConfig);
    if (!valid) {
      throw new Error(`参数错误: ${errors.join('; ')}`);
    }

    // 调用处理服务
    return await processFile(
      originalFile,
      currentType,
      params,
      (progress) => {
        dispatch(setProgress(progress));
      }
    );
  }
);

const processingSlice = createSlice({
  name: 'processing',
  initialState: {
    currentType: null,         // 当前退化类型
    types: {},                 // 所有退化类型配置
    isProcessing: false,       // 是否正在处理
    progress: 0,               // 处理进度
    error: null                // 处理错误
  },
  reducers: {
    setCurrentType: (state, action) => {
      state.currentType = action.payload;
      state.error = null;
    },
    setProgress: (state, action) => {
      state.progress = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 处理退化类型配置获取
      .addCase(fetchDegradationTypes.fulfilled, (state, action) => {
        state.types = action.payload;
      })
      .addCase(fetchDegradationTypes.rejected, (state, action) => {
        state.error = '获取功能配置失败: ' + (action.error.message || '未知错误');
      })
      // 处理文件处理过程
      .addCase(processFileAsync.pending, (state) => {
        state.isProcessing = true;
        state.progress = 0;
        state.error = null;
      })
      .addCase(processFileAsync.fulfilled, (state) => {
        state.isProcessing = false;
        state.progress = 100;
      })
      .addCase(processFileAsync.rejected, (state, action) => {
        state.isProcessing = false;
        state.progress = 0;
        state.error = action.error.message || '处理失败，请重试';
      });
  }
});

export const { setCurrentType, setProgress, clearError } = processingSlice.actions;
export default processingSlice.reducer;
