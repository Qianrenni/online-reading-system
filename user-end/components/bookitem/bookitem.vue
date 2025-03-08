<template>
	<view class="item" @click="tabinfo">
		<view class="img_box">
			<image :src="book.url" mode="scaleToFill" style="border-radius: 6px;"></image>
		</view>
		<view class="info">
			<view class="name" v-text="book.name"></view>
			<view class="desc" v-text="book.desc"></view>
			<view class="info_foot">
				<!-- <label v-text=""></label> -->
				<u-tag :text="book.author" type="info" mode="dark" size="mini" bgColor="#B0C4DE"/>
				<u-tag :text="book.label?'收费':'免费'" type="info" mode="dark" size="mini"
					:bgColor="book.label?'red':'green'" />
				<!-- <label class="blue" v-text="val.number"></label> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "bookitem",
		props: ['book'],
		data() {
			return {

			};
		},
		methods: {
			async tabinfo() {
				await this.$store.dispatch('updateBook',this.book);
				uni.navigateTo({
					url: '/pages/book/bookinfo'
				})
			},
		},


	}
</script>

<style scoped lang="scss">
	.item {
		// margin-left: 20rpx;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		cursor: pointer;
		margin: 20rpx;
		margin-bottom: 10rpx;
		overflow: hidden;
		border-bottom: 1px solid #f0f1f2;

		.img_box {
			width: 150rpx;
			height: 200rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.info {
			padding: 0 20rpx;
			width: calc(100% - 230rpx);
			display: flex;
			flex-direction: column;
			.name {
				font-size: 32rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.desc {
				font-size: 26rpx;
				color: #969ba3;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				-webkit-box-orient: vertical;
			}

			.info_foot {
				position: relative;
				height: 40rpx;
				line-height: 40rpx;
				text-align: right;
				display: flex;
				justify-content: flex-end;
				align-items: center;
				overflow: hidden;
				text-overflow: ellipsis;
				text-wrap: nowrap;
			}
		}
	}
</style>