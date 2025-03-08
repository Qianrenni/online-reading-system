<template>
  <view class="content"
  :style="{'background':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}"
  >
    <!-- 使用 uni-nav-bar 组件 -->
    <uni-nav-bar 
      title="充值" 
      left-icon="back" 
      @clickLeft="goback" 
      :fixed="true"
	  statusBar
	  :backgroundColor="theme.currentTheme.backgroundColors[1]"
	  :color="theme.currentTheme.foregroundColors[0]"
    />

    <!-- 余额信息 -->
    <view class="balance" >
      <text class="balance-amount">余额:{{balance}} 书币</text>
    </view>

    <!-- 充值选项 -->
    <view class="recharge-box" :style="{'background':theme.currentTheme.backgroundColors[1]}">
      <view class="recharge-label">选择充值金额</view>
      <view class="recharge-options">
        <view 
          class="recharge-option" 
          v-for="(option, index) in rechargeOptions" 
          :key="index"
          @click="selectRechargeOption(index)"
          :class="{ 'selected': selectedOption === index }"
        >
          <text>{{ option.coins }}</text>
          <text class="amount">￥{{ option.price }}</text>
        </view>
      </view>
	  <view class="quantity-container">
		  <view class="recharge-label">充值份数(上限99份)</view>
		  <view class="caculate">
			  <view @click="count(-1)" >-</view>
			  <input type="number" name="quantity" id="quantity" v-model="quantity" maxlength="2" />
			  <view  @click="count(1)">+</view>
		  </view>
	  </view>
    </view>

    <!-- 支付方式 -->
    <view class="recharge-path" :style="{'background':theme.currentTheme.backgroundColors[1]}">
      <view class="recharge-label">选择支付方式</view>
      <radio-group @change="selectPaymentMethod">
        <view class="payment-method" v-for="method in paymentMethods" :key="method.value">
          <radio :value="method.value" :checked="selectedPayment === method.value" />
		  <u-icon name="zhifubao-circle-fill" size="36" color="blue"></u-icon>
          <text>{{ method.label }}</text>
        </view>
      </radio-group>
    </view>

    <!-- 充值按钮 -->
    <u-button class="container-button" type="primary" shape="circle" @click="proceedToRecharge" :disabled="loading">充值</u-button>
  </view>
</template>

<script>
 import {mapState}	 from 'vuex'
 import { theme } from '../../configJs/theme';
export default {
  data() {
    return {
		theme:theme,
		quantity:1,
      scrollTop: 0,
      rechargeOptions: [
        { coins: '60书币', price: 6 },
        { coins: '280书币', price: 28 },
        { coins: '680书币', price: 68 },
        { coins: '1280书币', price: 128 },
        { coins: '3280书币', price: 328 },
        { coins: '6480书币', price: 648 }
      ],
      selectedOption: null,
      paymentMethods: [
        { label: '支付宝', value: 'alipay' },
        // { label: '微信', value: 'wechat' }
      ],
      selectedPayment: 'alipay' ,// 默认选中支付宝
	  loading:false
    };
  },
  computed:{
	  ...mapState({
		  balance:state=>state.userbalance
	  })
  }
  ,
  methods: {
	  count(dx){
		  let result=dx+parseInt(this.quantity);
		if(result>0&&result<=99){
			this.quantity=result;
		}
	  },
    goback() {
      uni.navigateBack();
    },
    selectRechargeOption(index) {
      this.selectedOption = index;
      console.log('Selected Recharge Option:', this.rechargeOptions[index]);
    },
    selectPaymentMethod(event) {
      this.selectedPayment = event.detail.value;
      console.log('Selected Payment Method:', this.selectedPayment);
    },
    proceedToRecharge() {
      if (this.selectedOption !== null && this.selectedPayment&&this.$store.state.userId) {
        const selectedOption = this.rechargeOptions[this.selectedOption];
        console.log(`Proceeding to recharge with ${selectedOption.coins} using ${this.selectedPayment}`);
		this.loading=true;
		uni.showLoading({
			title:"加载中"
		});
		let that=this;
		let returnUrl=null;
		// #ifdef H5
			returnUrl="";
		// #endif
		uni.request({
			url:this.$store.state.BaseUrl+"/recharge/api/recharge",
			data:{
				  user_id: this.$store.state.userId,
				  amount: selectedOption.price*this.quantity
			},
			method:"POST",
			success(res) {
				if(res.data.redirect_url){
					// #ifdef H5
					// 如果是在H5网页端，使用window.location.href打开链接
					window.open(res.data.redirect_url,'_blank');
					// #endif
					
					// #ifdef APP
					// 如果是在APP中，使用plus.runtime.openURL打开链接
					plus.runtime.openURL(res.data.redirect_url);
					// #endif
					uni.navigateBack();
					that.$u.vuex('recharging',true);
					that.$u.vuex('queryBalanceTimer',null);
					that.$u.vuex('queryBalanceTimer',setTimeout(()=>{
						that.$u.vuex('recharging',false);
					},5*1000*60));
				}
				
			},
			complete(){
				uni.hideLoading();
				that.loading=false;
			}
		})
      } else {
        // console.warn('Please select a recharge option and payment method.');
		uni.showToast({
			title:"请选择金额和方式 !",
			icon:'none'
		})
      }
    }
  }
};
</script>

<style  lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column; /* 确保子元素垂直排列 */
  align-items: center; /* 水平居中对齐 */
  justify-content: flex-start; /* 内容从顶部开始 */
  min-height: 100vh; /* 使用最小高度为视口高度 */
  position: relative;
  z-index: 0;
}

.balance {
  margin-top: 40px;
  padding: 10px;
  font-size: 12px;
  width: 90%;
  max-width: 400px;
  text-align: left;
  font-weight: bold;
}

.balance-amount {
  font-size: 15px;
  font-weight: bold;
}

.recharge-label {
  font-size: 12px;
  margin-top: 2%;
  margin-left: 5%;
}

.recharge-options {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  max-width: 400px;
}

.recharge-option {
  width: 30%;
  text-align: center;
  border: 1px solid #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10rpx;
  box-sizing: border-box;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.recharge-option .amount {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  transition: color 0.3s ease;
}

.recharge-option.selected {
  border-color: red;
  color: red;
  background-color: rgba(255, 0, 0, 0.1);
}

.recharge-option.selected .amount {
  color: red;
}

.recharge-box {
  margin-top: 5px;
  width: 90%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;
}

.recharge-path {
  width: 90%;
  max-width: 400px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  box-sizing: border-box;
}

.container-button {
  margin-top: 15px;
  margin-left: auto;
  margin-right: auto;
  display: block;
  background-color: red;
}

.payment-method {
  display: flex;
  
  justify-content: baseline;
  margin-top: 10px;
}

.payment-method radio {
  margin-right: 5px;
}
.quantity-container{
	width: 100%;
	display: flex;
	justify-content: space-between;
	.caculate{
		display: flex;
		
		text-align: center;
		input ,view{
			width: 80rpx;
			margin-right: 35rpx;
			font-size: 35rpx;
		  border: 1px solid #ddd;
		}
		view{
			cursor: pointer;
		}
	}
}
</style>z