<template>
	<view class="book_list">
		<view v-if="showHead" class="title">
			{{title}}
			<label v-text="subTitle"></label>
			<view class="more" v-if="isMore">更多></view>
		</view>
		<bookitem v-for="(val,index) in list" :key="val.id"
		:book="val"
		></bookitem>
	</view>
</template>

<script>
	export default {
		props: ["book"],
		data() {
			return {
				showHead: this.book.showHead,
				// 标题
				title: this.book.tit,
				// 副标题
				subTitle: this.book.subTit,
				//是否显示更多
				isMore: false,
				// 数据列表
				list: this.book.list
			}
		},
		onLoad() {

		},
		created() {

		},
		methods: {
		}
	}
</script>

<style lang="scss" scoped>
	.book_list {
		margin: 0 20rpx;
		.title {
			margin: 20rpx;
			padding: 0 10rpx;
			font-size: 32rpx;
			font-weight: 700;
			border-left: 2px solid #ed424b;
			position: relative;

			label {
				font-size: 28rpx;
				color: #999;
				margin-left: 10rpx;
			}

			.more {
				position: absolute;
				right: 20rpx;
				top: 50%;
				margin-top: -20rpx;
				line-height: 40rpx;
				color: #999;
			}
		}
	}
</style>