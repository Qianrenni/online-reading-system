<template>
	<view :style="{'background':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}"
		class="page-wrap">
		<uni-nav-bar statusBar title="书籍详情" left-icon="back" @clickLeft="goback"
			:backgroundColor="theme.currentTheme.backgroundColors[1]" :color="theme.currentTheme.foregroundColors[0]"
			:fixed="true" :border="false" />
		<view class="status_bar">
			<view class="content">
				<view class="wrap">
					<view class="header">
						<image :src="book.url" mode="aspectFill"></image>
						<view class="header-content">
							<view class="booktitle">{{book.name}}</view>
							<view >
								<u-tag :text="book.author" type="info" mode="dark" size="mini" bgColor="#B0C4DE"/>
							</view>
							<!-- 							<view class="u-flex u-font-25">
								{{book.number}}
							</view> -->
							<view>
								<u-tag :text="book.label?'收费':'免费'" type="info" mode="dark" size="mini"
									:bgColor="book.label?'red':'green'" />
								<u-tag 
								   v-if="book.free_pages > 0 "
								  :text="`试看${book.free_pages}章`" 
								  type="info" 
								  mode="dark" 
								  size="mini"
								  bgColor="green" 
								/>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="wrap" style="margin-top:10px;margin-left: 20rpx;">
			<view style="font-weight: bold;font-size: 33rpx;">内容简介</view>
			<view style="padding: 10rpx;">
				<u-read-more :shadowStyle="shadowStyle" style="height: auto;" :toggle="true" show-height="250">
					<rich-text :style="{'-webkit-text-fill-color':theme.currentTheme.foregroundColors[0]}"
						:nodes="book.desc"></rich-text>
				</u-read-more>
			</view>
			<view class="u-flex" @click="tabcatalog" :style="{'background':theme.currentTheme.backgroundColors[1]}">
				<view class="u-flex-1" style="font-weight: bold;font-size: 33rpx;">目录</view>
				<u-section class="u-flex-6" color="#909399" :show-line="false" :bold="false"
					:title="`共${catalog.length}章`" sub-title="查看更多"></u-section>
			</view>
		</view>
		<uni-popup ref="popup" type="bottom">
			<view class="group" :style="{'background': theme.currentTheme.backgroundColors[1]}">
				<view class="header">
					<view class="title">目录</view>
				</view>
				<view class="content">
					<view style="position: absolute; left: 40rpx; color: #2979ff;">共{{catalog.length}}章</view>
					<view style="position: absolute; right: 40rpx;" @click="tabsore">
						<u-icon custom-prefix="icon-book" :name="catalogOrder ? 'daoxu' : 'zhengxu'"
							:label="catalogOrder ? '倒序' : '正序'" size="28" color="#2979ff"
							label-color="#2979ff"></u-icon>
					</view>
				</view>
				<scroll-view scroll-y="true" style="height: 60vh;">
					<u-cell-group v-for="item in catalogCopy" :key="item.index">
						<u-cell-item
							:style="{'backgroundColor': theme.currentTheme.backgroundColors[1], '-webkit-text-fill-color': theme.currentTheme.foregroundColors[0]}"
							:title="item.title" @click="goread(item.index)">
						</u-cell-item>
					</u-cell-group>
				</scroll-view>
			</view>
		</uni-popup>
<!-- 		<view class="wrap" style="margin-left: 20rpx;">
			<view style="font-weight: bold;font-size: 33rpx;margin-bottom: 10rpx">首页</view>
						<u-read-more :shadowStyle="shadowStyle" :toggle="true">
				<u-parse :html="text" :style="{color:theme.currentTheme.foregroundColors[0]}">
					
				</u-parse>
			</u-read-more>
			<u-parse :html="bookindex" :style="{color:theme.currentTheme.foregroundColors[0]}">

			</u-parse>
		</view> -->
		<u-divider :color="theme.currentTheme.foregroundColors[0]"
			:bgColor="theme.currentTheme.backgroundColors[1]">我是有底线的</u-divider>
		<view style="height:200rpx;width: 100%;"></view>
		<view class="tabbar u-border-top u-flex tabbar_bottom"
			:style="{'backgroundColor':theme.currentTheme.backgroundColors[1]}">
			<view class="u-flex-7 u-text-center" @click="addBookToShelf" style="cursor: pointer;">
				<u-icon custom-prefix="icon-book" name="jiarushujia" size="40" label-size="30" label="加入书架"
					color="#2979ff" label-color="#2979ff"></u-icon>
			</view>
			<u-button @click="goread()" class="u-flex-6" type="primary" shape="circle"
				style="margin: 10rpx;background-image: linear-gradient(45deg, #0081ff, #1cbbb4);">免费阅读</u-button>
		</view>
	</view>
</template>

<script>
	import {
		theme
	} from '../../configJs/theme';
	import store from '../../store';
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				theme: theme,
				shadowStyle: {
					backgroundImage: theme.currentTheme.backgroundMask,
					paddingTop: "100rpx",
					marginTop: "-100rpx",
				}
			}
		},
		computed: {
			...mapState({
				catalog: state => state.catalog,
				bookindex: state => state.bookindex,
				catalogOrder: state => state.catalogOrder,
				catalogCopy: state => state.catalogCopy,
				book: state => state.book
			})
		},
		methods: {
			async addBookToShelf() {
				uni.showLoading({

				});
				await store.dispatch('addBookToShelf', this.book);
				uni.hideLoading();
			},
			goback: function(e) {
				uni.switchTab({
					url: '/pages/index/index',
				});
			},
			tabcatalog() {
				console.log("展示目录")
				this.$refs.popup.open();
			},
			tabsore() {

				this.$store.commit('reverseCatalog');
			},
			goread(index) {
				if (index) {
					this.$refs.popup.close();
				}

				let bookAndChapter = this.$store.state.bookAndChapter;
				let updateChapterId = 1;
				if (index) {
					updateChapterId = index;
				} else if (bookAndChapter[this.book.id]) {
					updateChapterId = bookAndChapter[this.book.id];
				}
				index = updateChapterId;
				if (this.book.label) {
					if (index && index > this.book.free_pages) {
						if (!store.state.bookPurchased) {
							uni.showModal({
								confirmColor: '#dc3545',
								content: "后面的内容需要付费阅读,是否购买?",
								success: function(res) {
									if (res.confirm) {
										console.log('用户点击确定');
										uni.navigateTo({
											url: '/pages/purchase/purchase'
										})
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							})
						} else {
							this.record(updateChapterId);
						}
					} else {
						this.record(updateChapterId);
					}
				} else {

					this.record(updateChapterId);
				}



			},
			record(updateChapterId) {
				store.commit('updateBookAndChapter', {
					bookId: this.book.id,
					chapterId: updateChapterId
				});
				// 将更新后的对象存回本地存储
				uni.navigateTo({
					url: '/pages/book/read'
				});
			}
		}
	}
</script>

<style scoped lang="scss">
	.status_bar {
		width: 100%;
		overflow: hidden;
	}

	.wrap {
		padding: 18rpx;
	}

	.header {
		display: flex;
		height: auto;
		font-size: 32rpx;
		padding: 0rpx 35rpx;

		.header-content {
			display: flex;
			flex-direction: column;
			margin-left: 30rpx;

			.booktitle {
				font-family: sans-serif;
				font-size: 38rpx;
				font-weight: bold;
			}

			.bookcontent {
				font-size: 28rpx;
				margin-top: 10rpx;
			}
		}
	}

	.header image {
		width: 180rpx;
		height: 240rpx;
		border-radius: 8rpx;
		margin-left: 15rpx;
	}


	.group {
		width: 100%;
		padding: 18rpx;
		overflow: hidden;
		border-top-left-radius: 15px;
		border-top-right-radius: 15px;

		.header {
			justify-content: center;

			.title {
				font-size: 35rpx;
				font-weight: bold;
			}

			.close {

				position: absolute;
				right: 40rpx;
				padding-top: 10rpx;
			}
		}

		.content {
			padding: 30rpx 35rpx;
			margin-bottom: 30rpx;
		}
	}

	.tabbar {
		width: 100%;
		height: 55px;
		position: fixed;
		bottom: 0;
	}
</style>