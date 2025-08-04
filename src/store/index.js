import { configureStore } from '@reduxjs/toolkit';
import fileReducer from './slices/fileSlice';
import processingReducer from './slices/processingSlice';
import paramsReducer from './slices/paramsSlice';

export const store = configureStore({
  reducer: {
    file: fileReducer,          // 管理文件相关状态
    processing: processingReducer,  // 管理处理状态
    params: paramsReducer       // 管理退化参数
  }
});
