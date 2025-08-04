import { createSlice } from '@reduxjs/toolkit';

// 初始参数（确保所有值都是可序列化的基本类型）
const initialState = {
  blur: { kernelSize: 5, standardDeviation: 1.0 },
  downsampling: { method: 'bilinear', scale: 0.5 },
  noise: { type: 'gaussian', intensity: 0.1, density: 0.05 },
  encoding: { method: 'jpeg', quality: 80, bitrate: 1000 },
  scratch: { count: 5, width: 2, brightness: 0.8 },
  dirtySpot: { count: 8, diameter: 10, color: '#888888' },
  锯齿: { scale: 1.5, intensity: 0.3 },
  interlacing: { strength: 0.6 },
  edgeArtifact: { kernelSize: 3, standardDeviation: 0.8 },
  flicker: { frequency: 5, amplitude: 0.2 },
  jitter: { frequency: 3, range: 5 },
  motionBlur: { angle: 45, length: 10 }
};

const paramsSlice = createSlice({
  name: 'params',
  initialState,
  reducers: {
    /**
     * 更新参数（确保只处理纯对象）
     * @param {Object} action.payload - { type: 退化类型, params: 要更新的参数对象 }
     */
    updateParams: (state, action) => {
      const { type, params } = action.payload;
      
      // 严格校验：只处理已知类型，且params必须是纯对象
      if (state[type] && typeof params === 'object' && params !== null && !Array.isArray(params)) {
        // 合并参数，只保留初始定义的字段（防止注入非预期字段）
        const validParams = {};
        Object.keys(state[type]).forEach(key => {
          if (params.hasOwnProperty(key)) {
            validParams[key] = params[key];
          }
        });
        state[type] = { ...state[type], ...validParams };
      } else {
        console.warn(`无效的参数更新：类型=${type}，参数=${JSON.stringify(params)}`);
      }
    },
    
    /**
     * 重置参数到初始值
     * @param {string} action.payload - 退化类型
     */
    resetParams: (state, action) => {
      const type = action.payload;
      if (initialState[type]) {
        // 深拷贝初始值，避免引用污染
        state[type] = JSON.parse(JSON.stringify(initialState[type]));
      }
    }
  }
});

export const { updateParams, resetParams } = paramsSlice.actions;
export default paramsSlice.reducer;