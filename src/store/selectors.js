// store/selectors.js（单独的选择器文件）
import { createSelector } from '@reduxjs/toolkit';

// 基础选择器：获取整个params状态
const selectParams = (state) => state.params;

// 记忆化选择器：根据id获取参数（关键！）
export const selectParamsByType = createSelector(
  [
    selectParams,        // 依赖1：整个params状态
    (state, type) => type // 依赖2：当前类型id
  ],
  (params, type) => {
    // 只在参数变化时返回新对象
    return params[type] ? { ...params[type] } : {};
  }
);