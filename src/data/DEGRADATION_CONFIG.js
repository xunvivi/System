export const DEGRADATION_CONFIG = {
  // 第一阶段和第二阶段共有的退化类型
  common: {
    blur: {
      name: '模糊',
      method: '高斯模糊',
      params: {
        kernel_size: {
          type: 'int',
          min: 1,
          max: 51,
          step: 2, // 确保是奇数
          default: 15,
          description: '模糊核大小（核越大，越模糊）',
          unit: 'px'
        },
        sigma: {
          type: 'float',
          min: 0.1,
          max: 10.0,
          step: 0.1,
          default: 2.0,
          description: '标准差（值越高，越模糊）'
        }
      }
    },
    resample: {
      name: '下采样',
      method: '最近邻插值、双线性插值、双三次插值',
      params: {
        scale_factor: {
          type: 'float',
          min: 0.1,
          max: 1.0,
          step: 0.1,
          default: 0.5,
          description: '缩放比例'
        },
        interpolation: {
          type: 'select',
          options: [
            { value: 'nearest', label: '最近邻插值' },
            { value: 'bilinear', label: '双线性插值' },
            { value: 'bicubic', label: '双三次插值' }
          ],
          default: 'bilinear',
          description: '插值方法'
        }
      }
    },
    noise: {
      name: '噪声',
      method: '高斯噪声、椒盐噪声、泊松噪声',
      params: {
        noise_type: {
          type: 'select',
          options: [
            { value: 'gaussian', label: '高斯噪声' },
            { value: 'salt_pepper', label: '椒盐噪声' },
            { value: 'poisson', label: '泊松噪声' }
          ],
          default: 'gaussian',
          description: '噪声类型'
        },
        intensity: {
          type: 'float',
          min: 0.01,
          max: 1.0,
          step: 0.01,
          default: 0.1,
          description: '噪声强度'
        },
        density: {
          type: 'float',
          min: 0.01,
          max: 0.5,
          step: 0.01,
          default: 0.05,
          description: '噪声密度（仅椒盐噪声）'
        }
      }
    },
    compression: {
      name: '编码压缩',
      method: 'JPEG压缩、MPEG-2压缩、H.264压缩、H.265压缩',
      params: {
        codec: {
          type: 'select',
          options: [
            { value: 'jpeg', label: 'JPEG压缩' },
            { value: 'mpeg2', label: 'MPEG-2压缩' },
            { value: 'h264', label: 'H.264压缩' },
            { value: 'h265', label: 'H.265压缩' }
          ],
          default: 'jpeg',
          description: '压缩编码方式'
        },
        quality: {
          type: 'int',
          min: 1,
          max: 100,
          step: 1,
          default: 30,
          description: '压缩质量（值越低压缩越强）'
        },
        bitrate: {
          type: 'int',
          min: 100,
          max: 10000,
          step: 100,
          default: 1000,
          description: '目标码率（kbps）'
        }
      }
    }
  },
  // 第三阶段图像退化类型
  image: {
    scratch: {
      name: '划痕',
      method: '叠加随机线条',
      params: {
        num_scratches: {
          type: 'int',
          min: 1,
          max: 50,
          step: 1,
          default: 10,
          description: '划痕数量'
        },
        line_width: {
          type: 'int',
          min: 1,
          max: 10,
          step: 1,
          default: 2,
          description: '线条宽度'
        },
        brightness: {
          type: 'int',
          min: 0,
          max: 255,
          step: 1,
          default: 200,
          description: '线条亮度（0-255，值越高越亮）'
        }
      }
    },
    dirt: {
      name: '脏点',
      method: '叠加不规则形状斑点',
      params: {
        num_spots: {
          type: 'int',
          min: 1,
          max: 100,
          step: 1,
          default: 20,
          description: '脏点数量'
        },
        spot_size: {
          type: 'int',
          min: 2,
          max: 20,
          step: 1,
          default: 5,
          description: '斑点直径'
        },
        spot_color: {
          type: 'int',
          min: 0,
          max: 255,
          step: 1,
          default: 50,
          description: '斑点颜色（0-255，值越低越暗）'
        }
      }
    },
    aliasing: {
      name: '锯齿',
      method: '采用上采样下采样再量化',
      params: {
        scale_factor: {
          type: 'float',
          min: 0.2,
          max: 0.8,
          step: 0.1,
          default: 0.5,
          description: '缩放比例（越大锯齿越明显）'
        }
      }
    },
    interlace: {
      name: '隔行',
      method: '模拟隔行扫描，再重采样',
      params: {
        intensity: {
          type: 'float',
          min: 0.1,
          max: 1.0,
          step: 0.1,
          default: 0.5,
          description: '隔行强度'
        }
      }
    },
    edge_artifact: {
      name: '边缘伪影',
      method: '2D sinc滤波、锐化',
      params: {
        kernel_size: {
          type: 'int',
          min: 3,
          max: 21,
          step: 2,
          default: 5,
          description: '核大小'
        },
        sigma: {
          type: 'float',
          min: 0.1,
          max: 5.0,
          step: 0.1,
          default: 1.0,
          description: '标准差'
        }
      }
    }
  },
  // 第三阶段视频退化类型
  video: {
    flicker: {
      name: '闪烁',
      method: '调整帧亮度或对比度',
      params: {
        frequency: {
          type: 'int',
          min: 1,
          max: 30,
          step: 1,
          default: 5,
          description: '闪烁频率（帧数）'
        },
        amplitude: {
          type: 'float',
          min: 0.1,
          max: 1.0,
          step: 0.1,
          default: 0.3,
          description: '亮度波动幅度'
        }
      }
    },
    shake: {
      name: '抖动',
      method: '对图像随机添加相位偏移',
      params: {
        frequency: {
          type: 'int',
          min: 1,
          max: 10,
          step: 1,
          default: 3,
          description: '抖动频率（帧数）'
        },
        displacement: {
          type: 'int',
          min: 1,
          max: 20,
          step: 1,
          default: 5,
          description: '位移范围（像素）'
        }
      }
    },
    motion_blur: {
      name: '运动模糊',
      method: '点扩散函数（PSF）',
      params: {
        angle: {
          type: 'int',
          min: 0,
          max: 360,
          step: 1,
          default: 0,
          description: '运动角度'
        },
        length: {
          type: 'int',
          min: 5,
          max: 50,
          step: 1,
          default: 15,
          description: '运动长度'
        }
      }
    }
  }
};