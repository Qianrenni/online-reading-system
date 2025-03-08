// 内存缓存工具
export const memoryCache = {
  cache: {}, // 缓存对象

  // 获取缓存
  getCache(key) {
    const cachedItem = this.cache[key];
    if (cachedItem && cachedItem.expireTime > Date.now()) {
      return cachedItem.data; // 返回未过期的缓存数据
    }
    return null; // 缓存不存在或已过期
  },

  // 设置缓存
  setCache(key, data, expireTime = 5 * 60 * 1000) { // 默认缓存 5 分钟
    this.cache[key] = {
      data,
      expireTime: Date.now() + expireTime
    };
  },

  // 清除缓存
  clearCache(key) {
    if (key) {
      delete this.cache[key]; // 清除指定缓存
    } else {
      this.cache = {}; // 清除所有缓存
    }
  }
};