<template>
  <view class="content">
    <!-- adpid="1111111111" 此广告位标识仅在HBuilderX标准基座中有效，仅用于测试 -->
    <!-- 广告后台申请的广告位(adpid)需要自定义基座/云打包/本地打包后生效 -->
    <view class="ad-view">
      <ad adpid="1111111111" @load="onload" @close="onclose" @error="onerror"></ad>
    </view>
  </view>
</template>
 
<script>
export default {
  data() {
    return {
      title: 'ad'
    }
  },
  methods: {
    onload(e) {
      console.log("onload");
    },
    onclose(e) {
      console.log("onclose: " + e.detail);
    },
    onerror(e) {
      console.log("onerror: " + e.detail.errCode + " message:: " + e.detail.errMsg);
    }
  }
}
</script>
 
<style>
  .content {
    background-color: #DBDBDB;
    padding: 10px;
  }
 
  .ad-view {
    background-color: #FFFFFF;
    margin-bottom: 10px;
  }
</style>
