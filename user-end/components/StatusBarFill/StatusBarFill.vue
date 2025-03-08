<template>
  <view class="status-bar-fill" :style="fillStyle"></view>
</template>

<script>
export default {
  data() {
    return {
      fillStyle: {}
    };
  },
  mounted() {
    this.setStatusBarHeight();
  },
  methods: {
    setStatusBarHeight() {
      // 获取状态栏高度
      const statusBarHeight = uni.getSystemInfoSync().statusBarHeight;
      // 动态设置填充高度
      this.fillStyle = {
        height: `${statusBarHeight}px`
      };
    }
  }
};
</script>

<style scoped>
.status-bar-fill {
  width: 100vw;
}
</style>