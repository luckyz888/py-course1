export default {
  plugins: {
    // 将 oklch() 颜色函数转换为 rgb()，兼容360浏览器等旧浏览器
    '@csstools/postcss-oklab-function': {},
  },
};
