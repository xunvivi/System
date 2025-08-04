const degradationItems = [
  {
    id: "blur",
    name: "模糊",
    description: "退化方法：高斯模糊；退化因子：模糊核大小（核越大，越模糊）、标准差（差越高，越模糊）",
    iconClass: "fa fa-filter", 
  },
  {
    id: "resample",
    name: "下采样",
    description: "退化方法：最近邻插值、双线性插值、双三次插值；退化因子：缩放比例",
    iconClass: "fa fa-compress",
  },
  {
    id: "noise",
    name: "噪声",
    description: "退化方法：高斯噪声、椒盐噪声、泊松噪声；退化因子：噪声强度、噪声密度",
    iconClass: "fa fa-bolt",
  },
  {
    id: "compression",
    name: "编码压缩",
    description: "退化方法：JPEG压缩、MPEG - 2压缩、H.264压缩、H.265压缩；退化因子：量化参数、码率等",
    iconClass: "fa fa-file-archive-o",
  },
  {
    id: "scratch",
    name: "划痕",
    description: "退化方法：叠加随机线条；退化因子：划痕数量、线条宽度、线条亮度（偏灰、偏白）",
    iconClass: "fa fa-bug",
  },
  {
    id: "dirt",
    name: "脏点",
    description: "退化方法：叠加不规则形状斑点；退化因子：脏点数量、斑点直径、斑点颜色",
    iconClass: "fa fa-dot-circle-o",
  },
  {
    id: "aliasing",
    name: "锯齿",
    description: "退化方法：采用上采样下采样再量化；退化因子：缩放比例（越大锯齿越明显）",
    iconClass: "fa fa-bars",
  },
  {
    id: "interlace",
    name: "隔行",
    description: "退化方法：模拟隔行扫描，再重采样；退化因子：强度",
    iconClass: "fa fa-retweet",
  },
  {
    id: "edge_artifact",
    name: "边缘伪影",
    description: "退化方法：2D sinc滤波、锐化；退化因子：核大小、标准差",
    iconClass: "fa fa-object-ungroup",
  },
  {
    id: "flicker",
    name: "闪烁",
    description: "退化方法：调整帧亮度或对比度；退化因子：闪烁频率（帧数）、亮度波动幅度",
    iconClass: "fa fa-bolt",
  },
  {
    id: "shake",
    name: "抖动",
    description: "退化方法：对图像随机添加相位偏移；退化因子：抖动频率（帧数）、位移范围",
    iconClass: "fa fa-exchange",
  },
  {
    id: "motion_blur",
    name: "运动模糊",
    description: "退化方法：点扩散函数（PSF）；退化因子：运动角度、运动长度",
    iconClass: "fa fa-tint",
  },
];

export default degradationItems;
