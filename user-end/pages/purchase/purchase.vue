<template>

	<view style="height: 100vh;"
		:style="{background:theme.currentTheme.backgroundColors[0],color:theme.currentTheme.foregroundColors[0]}">
		<uni-nav-bar title="书籍购买" left-icon="back" :fixed="true" :border="true" statusBar
			:backgroundColor="theme.currentTheme.backgroundColors[1]" :color="theme.currentTheme.foregroundColors[0]"
			@clickLeft="goback" />
		<view style="display: flex;align-items: center;height: 90%;justify-content: center;
		 flex-direction: column;">
			<view class="content" :style="{background:theme.currentTheme.backgroundColors[2]}"
			style="border: 1px solid #ddd; padding: 15rpx;gap: 20rpx;">
				<image :src="book.url" mode="aspectFill" style="border-radius: 3px; border: 1px solid #ddd; "></image>
				<view class="info-list" :style="{color:theme.currentTheme.foregroundColors[0]}">
					<view class="info-item">
						<text>书名:</text>
						<view>{{ book.name }}</view>
					</view>
					<view class="info-item">
						<text>作者:</text>
						<view>{{ book.author }}</view>
					</view>
					<view class="info-item">
						<text>价格</text>
						<view>{{ book.price}} 书币</view>
					</view>
					<view class="info-item">
						<view><uni-icons :color="theme.currentTheme.foregroundColors[0]" type="wallet"
								size="16"></uni-icons>{{this.$store.state.userbalance}} 书币</view>
					</view>
					
				</view>
				
			</view>
			<button type="primary" @click="handlePurchase"  style="width: 500rpx;margin-top: 15px;" >立即购买</button>
		</view>
		
	</view>
</template>

<script>
	import {
		theme
	} from '../../configJs/theme';
import store from '../../store';
	export default {
		data() {
			return {
				book: this.$store.state.book,
				theme: theme
			};
		},
		onLoad() {},
		methods: {
			goback() {
				uni.navigateBack();
			},
			handlePurchase(){
				
				if(this.$store.state.userbalance<parseFloat(this.$store.state.book.price)){
					uni.showModal({
						content:"书币不足是否充值?",
						success: function (res) {
							
							if (res.confirm) {
							console.log('用户点击确定');
							uni.navigateTo({
								url:'/pages/user/recharge'
							})
							} else if (res.cancel) {
							console.log('用户点击取消');
							}
						}
					})
				}else{
					uni.request({
						url:this.$store.state.BaseUrl+'/book/purchase',
						method:'POST',
						data:{
							user_id:this.$store.state.userId,
							book_id:this.$store.state.book.id							
						},
						success(res){
							if(res.data.message){
								store.commit('updateUserbalance',res.data.new_balance);
								uni.showToast({
									title:"购买成功,马上跳转",
									icon:'none'
								})
								store.commit('$uStore', { name: 'bookPurchased', value:true});
								setTimeout(()=>{
									uni.navigateBack();
								},2000)
							}else{
								uni.showToast({
									icon:'error',
									title:'购买失败'
								})
							}
						}
					})
				}
			}
			
		}
	};
</script>

<style scoped>
	.content {
		justify-content: space-between;
		display: flex;
		align-items: center;
		max-width: 700rpx;
	}

	.info-list {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
		align-items: center;
	}

	.info-item text {
		font-weight: bold;
		margin-right: 10px;
	}

	.info-item view {
		flex: 1;
	}
</style>