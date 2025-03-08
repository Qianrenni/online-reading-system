<template>
	<view>
		<u-swipe-action :options="optionList" btn-width="120" v-for="(item,index) in book" :key="index"
		@click="removeBookFromShelf(item.id)"
			:bgColor="theme.currentTheme.backgroundColors[0]">
			<view class="u-body-item" @click="tabinfo(index)"
				:style="{'background':theme.currentTheme.backgroundColors[1]}">
				<image :src="item.url" mode="scaleToFill" style="border-radius: 6px;"  />
				<view class="content">
					<view class="booktitle">
						<view>{{ item.name }}</view>
					</view>
					<view class="bookfoot">
						<u-icon name="bookmark" color="u-type-info-dark"></u-icon>
						{{ item.read ==0 ?'未读' : '上次读到第'+item.read+'章' }}
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
				optionList: this.options || [],
			}
		},
		methods: {
			async	removeBookFromShelf(bookId){
				uni.showLoading({
					
				});
				await store.dispatch('removeBookFromShelf',bookId);
				uni.hideLoading();
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
			flex-direction: column;
			justify-content: space-between;
			margin-right: 30rpx;
			width: 460rpx;
			.booktitle {
				padding-top: 5rpx;
				font-size: 30rpx;
				line-height: 40rpx;
			}

			.bookfoot {
				display: flex;
				justify-content: flex-start;
				width: 100%;
			}
		}
	}
</style>