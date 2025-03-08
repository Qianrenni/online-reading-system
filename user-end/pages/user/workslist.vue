<template>
	<view>
		<nav-bar   title="已发布章节"  :scrollTop="scrollTop" fontColor="rgb(96, 98, 102)" transparentFixedFontColor="rgba(96, 98, 102)">
			<view @tap="goback" slot="left" style="padding-left: 15px;">
				<u-icon name="arrow-left" :size="45"></u-icon>
			</view>
			<view @tap="goback" slot="transparentFixedLeft" style="padding-left: 15px;color:rgb(96, 98, 102);">
				<u-icon name="arrow-left" :size="45"></u-icon>
			</view>
			<view slot="transparentFixedRight" style="color: #000000;">
				<u-icon @tap="gopage('/pages/user/send')"  name="plus" :size="50" style="margin-right: 20px;"></u-icon>
			</view> 
			
		</nav-bar>
		<!-- <view class="status_bar axin-bg-white" style="padding: 20rpx;height:120rpx;">
			<view class="axin-text-center">
				<text style="font-weight: bold;font-size: 40rpx;margin-right:10rpx;"></text>
			</view>
		</view>
		<view class="wrap" style="margin-top:0px;margin-left: 20rpx;">
		</view> -->
		<view style="height: 20rpx;"></view>
		<view >
			<mescroll-body-diy height="470px" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback">
				 
				<!-- <view v-if="vuex_bookstyle == 'list'"> --> 
					<u-swipe-action :options="options" btn-width="120" style="width:100%;padding-bottom: 40rpx;" v-for="(itme,index) in booklist" :key="index">
						<view class="u-body-item">
							<!-- <image :src="itme.image" mode="aspectFill"></image> -->
							<view class="content">
								<view class="booktitle">
									<view @click="tabinfo">{{ itme.name }}</view>
									<view style="position: absolute;right:120rpx;margin-right: 30rpx;">
										<u-tag  @tap="gopage('/pages/user/addworks')" style="margin-right: 10rpx;padding: 10rpx 10rpx;" text="编辑" type="error" mode="dark" size="mini" />
									</view>
								</view>
								<view @click="tabinfo" class="bookcontent u-line-2">
									审核评语：{{ itme.newestname }}
								</view>
								<view @click="tabinfo" class="bookfoot">
									<view class="msg u-type-info-dark">
										<u-icon name="bookmark" color="u-type-info-dark"></u-icon>
										{{ itme.read ==0 ?'审核中' : '已发布'}}
									</view>
								</view>
							</view>
						</view>
					</u-swipe-action>
				<!-- </view> -->
				<view style="margin-bottom:30rpx;">
					<u-divider>您的当前作品共有4个章节</u-divider>
				</view>
			</mescroll-body-diy>
		</view>
	</view>
</template>

<script>
	 
	export default { 
		data() {
			return {
				btnWidth: 180,
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
					}
				],		
				booklist:[
					{
						image: '/static/image/196.jpg',
						name: '第一章',
						read: 699,
						newest: 700,
						newestname: '我是大主宰',
						update: true,
						reading:true,
						finsh:false
					},
					{
						image: "https://pic.baike.soso.com/ugc/baikepic2/19045/cut-20191023134121-548097394_jpg_190_238_7208.jpg/300",
						name: '第一章',
						read: 0,
						newest: 1384,
						newestname: '第一千三百八十四章 再聚苍玄',
						update: false,
						reading:false,
						finsh:true,
					},
					{
						image: 'https://bookcover.yuewen.com/qdbimg/349573/1209977/180',
						name: '第一章',
						read: 0,
						newest: 1624,
						newestname: '第一千六百二十四章 结束，也是开始。〔大结局〕',
						update: false,
						reading:false,
						finsh:true,
					},
					{
						image: 'https://bookcover.yuewen.com/qdbimg/349573/2048120/180',
						name: '第一章',
						read: 0,
						newest: 1327,
						newestname: '新书大主宰已发',
						update: false,
						reading:false,
						finsh:true,
					}
				],
				scrollTop:0,
				downOption: {
					auto: false,
					offset: 50
				},
				upOption: {
					auto: true,
					use : false, 
					isBounce: true,
					page: {
						num : 0 , 
						size : 10 , 
						time : null 
					},
					empty:{
						use : true , 
						icon : null , 
						tip : "暂无相关数据",
						btnText : "", 
						fixed: false, 
						top: "100rpx", 
						zIndex: 99 
					}
				}
			}
		},
		onShow() {
			
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			tabinfo(){
				this.$u.route({
					url: '/pages/book/read'
				})
			},
			touchstart(index){
				console.log(index)  
				return false;
			},
			tabook(){
				if(this.vuex_bookstyle == 'card'){
					this.$u.vuex('vuex_bookstyle', 'list');
					this.$u.vuex('vuex_bookbutton', 'list-dot');
				}else if(this.vuex_bookstyle == 'list'){
					this.$u.vuex('vuex_bookstyle', 'card');
					this.$u.vuex('vuex_bookbutton', 'grid');
				}
				// this.mescroll.scrollTo(0);
				// this.mescroll.triggerDownScroll()
			},
			/*下拉刷新的回调 */
			downCallback() {
				setTimeout(() => {
				 	this.mescroll.endSuccess();
				}, 2000);
				
			},
			/*上拉加载的回调: 其中page.num:当前页 从1开始, page.size:每页数据条数,默认10 */
			upCallback(page) {
				setTimeout(() => {
				 	this.mescroll.endErr();
				}, 2000);
			},
			gohome(){
				this.$u.route({
					type: 'tab',
					url: 'pages/home/home'
				})
			},
				goback:function(e){
					uni.navigateBack({
						delta:1
					})
				},
			gopage:function(url){
				console.log(url);
				uni.navigateTo({
					url:url
				})
			}
		}
	}
</script>
<style lang="scss">
	.u-body-item {
		display:flex;
		height: auto;
		width: 100%;
		margin-left: 30rpx;
		margin-bottom: 20rpx;
		color: #333;
		overflow: hidden;
	
		.img_box {
			position: relative;
	
			.ranking {
				position: absolute;
				left: -50rpx;
				top: 0;
				width: 100%;
				text-align: center;
				z-index: 888;
				color: #fff;
				transform: rotate(-45deg);
				background-color: #4284ed;
			}
	
			.ranking {
				font-size: 20rpx;
				line-height: 30rpx;
				background-color: #969ba3;
	
				&.one {
					background-color: #e73500;
				}
	
				&.two {
					background-color: #f0643a;
				}
	
				&.three {
					background-color: #f0c53a;
				}
			}
		}
	
		.content {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 30rpx;
			margin-right: 30rpx;
	
			.booktitle {
				display: flex;
				padding-top: 5rpx;
				font-size: 30rpx;
				line-height: 40rpx;
			}
	
			.bookcontent {
				color: #82848a;
				font-size: 25rpx;
			}
	
			.bookfoot {
				align-items: flex-end;
				display: flex;
				justify-content: space-between;
				width: 100%;
	
				.msg {
					font-size: 12px;
				}
			}
		}
	}
	
	.u-body-item .images {
		width: 150rpx;
		flex: 0 0 150rpx;
		height: 200rpx;
	}
	
	.status_bar {
		height: calc(var(--status-bar-height) + 130px); 
		width: 100%;
	}
	.book-wrap {
		margin-bottom: 15px;
		border-radius: 2px;
		background-color: #fff;
		box-shadow: 5px 5px 5px 0 rgba(0, 0, 0, .05);
		-webkit-box-shadow: #d4d2d2 0px 0px 10px;
		-moz-box-shadow: #d4d2d2 0px 0px 10px;
		
		position: absolute;
		display: flex;
		overflow:hidden;
		height: auto;
		margin-top: -15px;
		left: 30rpx;
		right: 30rpx;
		border-radius: 16rpx;
		background-color: #FFFFFF;
		.title {
			text-align: center;
			writing-mode: vertical-lr;
			padding: 46rpx 10rpx;
			font-size: 23rpx;
			color: #2b85e4;
			font-weight: bold;
			background-color: #E3F1FC;
		}
		.content {
			display: flex;
			flex-direction: column;
			padding: 25rpx 25rpx 0 0;
			.booktitle {
				font-size: 28rpx;
				line-height: 40rpx;
			}
			.bookcontent {
				font-size: 25rpx;
			}
			.bookfoot {
				margin-top: 28rpx;
				font-size: 25rpx;
			}
		}
		.foot {
			display: flex;
			position: absolute;
			right: 30rpx;
		}
	}
	.book-wrap image {
		padding: 25rpx;
		width: 100rpx;
		height: 140rpx;
	}
</style>
