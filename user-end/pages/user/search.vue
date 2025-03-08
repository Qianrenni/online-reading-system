<template>
	<view>
		<nav-bar type="transparentFixed" title="搜索作品"  :scrollTop="scrollTop" fontColor="rgb(96, 98, 102)" transparentFixedFontColor="rgba(96, 98, 102)">
			<view slot="left" style="padding-left: 15px;">
				<u-icon name="arrow-left" :size="45"></u-icon>
			</view>
			<view @tap="goback" slot="transparentFixedLeft" style="padding-left: 15px;color:rgb(96, 98, 102);">
				<u-icon name="arrow-left" :size="45"></u-icon>
			</view>
			
		</nav-bar>
		<view class="status_bar axin-bg-white" style="padding: 20rpx;height:120rpx;">
			<view class="axin-text-center">
				<text style="font-weight: bold;font-size: 40rpx;margin-right:10rpx;"></text>
			</view>
		</view>
		<view class="wrap" style="margin-top:0px;margin-left: 20rpx;">
		</view>
		<view >
			<view class="axin-m-2">
				<u-search placeholder="请输入关键字" v-model="keyword"></u-search>
			</view>
			<view class="axin-flex axin-justify-between">
				<view class="axin-pl-3 axin-font-weight-bold axin-p-3">猜你喜欢</view>
				<view class="axin-pl-3 axin-text-primary axin-font-sm axin-p-3">换一批</view>
			</view>
		<list-box :book="booklist"  :options="options"></list-box>
						<view style="margin-bottom:30rpx;">
							<u-divider>您的当前为您推荐4个作品</u-divider>
						</view>
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
				keyword:'',
				booklist:[
					{
						image: '/static/image/196.jpg',
						name: '仙武帝尊',
						read: 699,
						newest: 700,
						newestname: '第700章 我是大主宰',
						update: true,
						reading:true,
						finsh:false
					},
					{
						image: "https://pic.baike.soso.com/ugc/baikepic2/19045/cut-20191023134121-548097394_jpg_190_238_7208.jpg/300",
						name: '元尊',
						read: 0,
						newest: 1384,
						newestname: '第一千三百八十四章 再聚苍玄',
						update: false,
						reading:false,
						finsh:true,
					},
					{
						image: 'https://bookcover.yuewen.com/qdbimg/349573/1209977/180',
						name: '斗破苍穹',
						read: 0,
						newest: 1624,
						newestname: '第一千六百二十四章 结束，也是开始。〔大结局〕',
						update: false,
						reading:false,
						finsh:true,
					},
					{
						image: 'https://bookcover.yuewen.com/qdbimg/349573/2048120/180',
						name: '武动乾坤',
						read: 0,
						newest: 1327,
						newestname: '第1327章 新书大主宰已发。',
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
