export const DEGRADATION_TYPES = {
  blur: { 
    name: '模糊', 
    description: '图像模糊退化', 
    params: { 
      blur_type: { type: 'select', options: ['高斯模糊', '均值模糊'], default: '高斯模糊', description: '模糊类型' },
      kernel_size: { type: 'int', min: 3, max: 51, default: 15, description: '模糊核大小（奇数）' }, 
      sigma: { type: 'float', min: 0.6, max: 5.0, default: 2.0, description: '标准差（仅高斯模糊有效）' } 
    } 
  },
  resample: { 
    name: '下采样', 
    description: '分辨率降低', 
    params: { 
      scale_factor: { type: 'float', min: 0.125, max: 1.0, default: 0.25, description: '缩放比例（支持1/8至1）' }, 
      interpolation: { type: 'select', options: ['区域插值', '双线性插值', '双三次插值'], default: '双三次插值', description: '插值方法（代码实际使用类型）' } 
    } 
  },
noise: { 
    id: 'noise',  // 必须有这个id用于识别
    name: '噪声', 
    description: '为视频/图像添加高斯、泊松或椒盐噪声，模拟真实场景中的信号干扰', 
    params: { 
      noise_type: { 
        type: 'select', 
        options: ['高斯噪声', '泊松噪声', '椒盐噪声'],  // 中文选项
        default: '高斯噪声', 
        description: '选择要添加的噪声类型' 
      }, 
      intensity: { 
        type: 'float', 
        min: 0.01, 
        max: 30.0, 
        default: 5.0, 
        step: 0.1, 
        description: '噪声强度参数'  // 这个描述会被动态替换
      }
    } 
  }
  ,
  compression: { 
    name: '编码压缩', 
    description: 'JPEG压缩退化', 
    params: { 
      quality: { type: 'int', min: 1, max: 95, default: 30, description: '压缩质量（代码常用1-95范围）' } 
    } 
  },
  motion_blur: { 
    name: '运动模糊', 
    description: '运动模糊效果', 
    params: { 
      angle: { type: 'int', min: 0, max: 360, default: 0, description: '运动角度' }, 
      length: { type: 'int', min: 10, max: 50, default: 15, description: '运动长度（代码常用10-20）' } 
    } 
  },
  scratch: { 
    name: '划痕', 
    description: '添加随机划痕', 
    params: { num_scratches: { type: 'int', min: 1, max: 50, default: 10, description: '划痕数量' }, 
      line_width: { type: 'int', min: 1, max: 10, default: 2, description: '线条宽度' }, 
      brightness: { type: 'int', min: 0, max: 255, default: 200, description: '线条亮度' } 
    } 
  },
  dirt: { 
    name: '脏点', 
    description: '添加脏点污渍', 
    params: { num_spots: { type: 'int', min: 1, max: 100, default: 20, description: '脏点数量' }, 
      spot_size: { type: 'int', min: 2, max: 20, default: 5, description: '脏点大小' }, 
      spot_color: { type: 'int', min: 0, max: 255, default: 50, description: '脏点颜色' } 
    } 
  },
  aliasing: { 
    name: '锯齿', 
    description: '锯齿效果', 
    params: { scale_factor: { type: 'float', min: 0.2, max: 0.8, default: 0.5, description: '缩放比例' } } 
  },
  interlace: { 
    name: '隔行', 
    description: '隔行扫描效果', 
    params: { intensity: { type: 'float', min: 0.1, max: 1.0, default: 0.5, description: '隔行强度' } } 
  },
  edge_artifact: { 
    name: '边缘伪影', 
    description: '边缘锐化伪影', 
    params: { kernel_size: { type: 'int', min: 3, max: 21, default: 5, description: '核大小' }, 
      strength: { type: 'float', min: 0.1, max: 3.0, default: 1.5, description: '锐化强度' } 
    } 
  },
  flicker: { 
    name: '闪烁', 
    description: '亮度闪烁', 
    params: { frequency: { type: 'int', min: 1, max: 30, default: 5, description: '闪烁频率（帧）' }, 
      amplitude: { type: 'float', min: 0.1, max: 1.0, default: 0.3, description: '亮度波动幅度' } 
    } 
  },
  shake: { 
    name: '抖动', 
    description: '位置抖动', 
    params: { frequency: { type: 'int', min: 1, max: 10, default: 3, description: '抖动频率（帧）' }, 
      displacement: { type: 'int', min: 1, max: 20, default: 5, description: '位移范围（像素）' } 
    } 
  }
};

  
