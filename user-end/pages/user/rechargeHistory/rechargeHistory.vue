<template>
  <view >
    <!-- 使用 uni-nav-bar 替代原有的 nav-bar -->
    <uni-nav-bar fixed statusBar title="充值记录" left-icon="back" @clickLeft="goBack"
      :backgroundColor="theme.currentTheme.backgroundColors[1]"
      :color="theme.currentTheme.foregroundColors[0]"
	  ></uni-nav-bar>

    <!-- 使用 scroll-view 包裹内容以便滚动 -->
    <scroll-view 
	:style="{'backgroundColor':theme.currentTheme.backgroundColors[0]}"
	scroll-y style="height: calc(100vh - var(--window-top) - var(--window-bottom));">
      <!-- 遍历每个充值记录 -->
      <block 
	   ,
	   v-for="(record, index) in rechargeRecords" :key="index">
        <!-- 每个充值记录作为一张卡片 -->
        <uni-card :isShadow="true" class="recharge-card" 
		:style="{'backgroundColor':theme.currentTheme.backgroundColors[1],'-webkit-text-fill-color':theme.currentTheme.foregroundColors[0]}"
		:title="'订单号: '+String(record.recharge_id)" :extra="formatDate(record.created_at)">
            <view style="display: flex; justify-content: space-between;">
				<text class="record-item">金额 {{ record.amount }} ￥</text>
				<text class="record-item">{{record.payment_status=="success"?'已完成':'未支付'}}</text>
			</view>
        </uni-card>
        <view class="divider"></view>
      </block>
    </scroll-view>
  </view>
</template>
<script>
	import { theme } from '../../../configJs/theme';
export default {
  data() {
    return {
		theme:theme,
      // 充值记录数据
      rechargeRecords: [
      ],
	  timer:null
    };
  },
  methods: {
    goBack() {
      uni.navigateBack({
        delta: 1
      });
    },
    formatDate(dateStr) {
      // 简单的日期格式化函数
      const date = new Date(dateStr);
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },
	network(){
		let that=this;
		uni.request({
			url:this.$store.state.BaseUrl+"/recharge/get",
				data:{
					userId:this.$store.state.userId
				},
				success(res){
					if(!res.data.error){
						that.rechargeRecords=res.data.reverse();
					}
					
				},
				complete() {
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

.record-item {
  display: block;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 5px;
}

.divider {
  height: 1px;
  background-color: #e5e5e5;
  margin: 15px 0;
}
</style>