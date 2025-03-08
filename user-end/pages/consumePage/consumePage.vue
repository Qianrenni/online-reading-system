<template>
  <view>
    <!-- 使用 uni-nav-bar 替代原有的 nav-bar -->
    <uni-nav-bar fixed statusBar title="购买记录" left-icon="back" @clickLeft="goBack"
      :backgroundColor="theme.currentTheme.backgroundColors[1]"
      :color="theme.currentTheme.foregroundColors[0]">
    </uni-nav-bar>

    <!-- 使用 scroll-view 包裹内容以便滚动 -->
    <scroll-view 
      :style="{'backgroundColor':theme.currentTheme.backgroundColors[0]}"
      scroll-y style="height: calc(100vh - var(--window-top) - var(--window-bottom));">
      
      <!-- 遍历每个购买记录 -->
      <block v-for="(record, index) in purchaseRecords" :key="index">
        <!-- 每个购买记录作为一张卡片 -->
        <uni-card :isShadow="true" class="purchase-card" 
          :style="{
            'backgroundColor': theme.currentTheme.backgroundColors[1], 
            '-webkit-text-fill-color': theme.currentTheme.foregroundColors[0],
          }"
          :title="'订单号: ' + String(record.payment_id)" :extra="record.create_date">
          <view style="display: flex; flex-direction: column;">
            <view class="record-item">
              <view class="label">书名</view>
              <text class="value">{{record.title}}</text>
            </view>
            <view class="record-item">
              <view class="label">作者</view>
              <view class="value">{{ record.author }}</view>
            </view>
			<view class="record-item">
			  <view class="label">价格: </view>
			  <view class="value">{{ record.price }} ￥</view>
			</view>
          </view>
        </uni-card>
        <view class="divider"></view>
      </block>
    </scroll-view>
  </view>
</template>
<script>
import { theme } from '../../configJs/theme';
export default {
  data() {
    return {
      theme: theme,
      // 购买记录数据
      purchaseRecords: [],
	  timer:null
    };
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },
	network(){
		let that = this;
		uni.request({
		  url: this.$store.state.BaseUrl+"/payment/get", // 更新API URL
		  data: {
		    userId: this.$store.state.userId
		  },
		method:'POST',
		  success(res){
		    if(!res.data.error){
		      that.purchaseRecords = res.data.reverse(); // 假设服务器返回的数据格式直接对应于purchaseRecords
		    }
		  },
		  complete(res){
			  uni.stopPullDownRefresh();
		  }
		  
		})
	}
  },
  onLoad(){
    if(this.timer){
		clearTimeout(this.timer);
	}
	this.timer=setTimeout(()=>{
		this.network()
	},300);
  },
  onPullDownRefresh(){
	  if(this.timer){
	  	clearTimeout(this.timer);
	  }
	  this.timer=setTimeout(()=>{
	  	this.network()
	  },1000);
  }
  
};
</script>
<style scoped>
/* 自定义样式 */
.recharge-card {
  margin-bottom: 15px;
  border-radius: 8px;
}

.divider {
  height: 1px;
  background-color: #e5e5e5;
  margin: 15px 0;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.label {
  flex: 1;
  font-weight: bold;
}

.value {
  flex: 3;
  word-wrap: break-word;
  white-space: normal;
  overflow: hidden;
}
</style>