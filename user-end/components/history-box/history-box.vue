<template>
	<view>
		<u-divider
		style="margin-bottom: 30rpx;"
		:style="{'background':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}"
		>阅读历史记录</u-divider>
		<u-swipe-action v-for="(item,index) in book" :key="index" :options="options" :bgColor="theme.currentTheme.backgroundColors[0]" btnWidth="120">
			<view class="u-body-item"
				:style="{'background':theme.currentTheme.backgroundColors[1]}"
				>
				<image :src="item.url" mode="scaleToFill" style="border-radius: 6px;"   @click="tabinfo(index)"/>
				<view class="content">
					<view class="left-content"  @click="tabinfo(index)">
						<view class="booktitle">
							<view>{{ item.name }}</view>
						</view>
						<view class="bookfoot">
							<u-icon name="bookmark" color="u-type-info-dark"></u-icon>
							{{item.read ==0 ?'未读' : '上次读到第'+item.read+'章'}}
						</view>
					</view>
					<view class="right-content">
						<view 
						:style="{color:theme.currentTheme.foregroundColors[1]}"
						style="border: 1px solid #ddd;
						padding: 15rpx;
						margin-right: 30rpx;
						"
						@click="handleClick(index)"
						>
							{{item.onshelf?'继续阅读':'加入书架'}}
						</view>
					</view>
				</view>
			</view>
		</u-swipe-action>
		
	</view>
</template>

<script>
	import {
		theme
	} from '../../configJs/theme'
	import store from '../../store'
	export default {
		props: ["book", "options"],
		data() {
			return {
				theme: theme,
			}
		},
		methods: {
			handleClick(index){
				if(this.book[index].onshelf){
					this.tabinfo(index);
				}else{
					store.dispatch('addBookToShelf',this.book[index]);
				}
			},
			async tabinfo(index) {
				uni.showLoading({

				});
				await store.dispatch('updateBook', this.book[index])
				uni.hideLoading();
				uni.navigateTo({
					url: '/pages/book/read'
				})
			},
			gopage(url) {
				console.log(url);
				uni.navigateTo({
					url: url
				})
			}
		},
		onShow(){
			console.log(this.book);
		}
	}
</script>

<style lang="scss" scoped>
	.u-body-item {
		
		height: auto;
		display: flex;
		margin-left: 30rpx;
		margin-bottom: 20rpx;
		margin-right: 30rpx;
		justify-content: flex-start;
		overflow: hidden;
		image{
			height: 250rpx;
			width: 175rpx;
		}
		.content {
			margin-left: 25rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			flex: 1;
			.left-content{
				height: 100%;
				display: flex;
				width: 250rpx;
				flex-direction: column;
				justify-content: space-between;
				overflow: hidden;

				.booktitle {
					padding-top: 5rpx;
					font-size: 30rpx;
					line-height: 40rpx;
				}
				
				.bookfoot {
					display: flex;
					justify-content: flex-start;
					text-overflow: ellipsis;
				}
			}
			.right-content{
				flex: 1;
				display: flex;
				justify-content: flex-end;
			}
		}
	}
</style>