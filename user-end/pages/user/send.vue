<template>
	<view>
		<nav-bar type="transparentFixed" title="添加章节"  :scrollTop="scrollTop" fontColor="rgb(96, 98, 102)" transparentFixedFontColor="rgba(96, 98, 102)">
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
			<mescroll-body-diy height="470px" @init="mescrollInit" :down="downOption" :up="upOption" @down="downCallback" @up="upCallback">
				<view class="axin-p-3">
				<u-form :model="form" ref="uForm">
						<u-form-item label="名称"><u-input v-model="form.name" /></u-form-item>
						<u-form-item label="权限">
							<u-radio-group v-model="radio">
								<u-radio v-for="(item, index) in radioList" :key="index" :name="item.name" :disabled="item.disabled">
									{{ item.name }}
								</u-radio>
							</u-radio-group>
						</u-form-item>
						<u-form-item label="内容"><u-input :maxlength="maxlength" :border="border" :height="height" :auto-height="autoHeight" v-model="form.intro" type='textarea'/></u-form-item>
						<!-- <u-form-item label="开关"><u-switch slot="right" v-model="switchVal"></u-switch></u-form-item> -->
					</u-form>
				</view>
				
				<view style="margin:60rpx;">
					<u-button type="primary">发布</u-button>
				</view>
				
			</mescroll-body-diy>
		</view>
	</view>
</template>

<script> 
	export default { 
		data() {
			return {
				border: true,
				height: 300,
				autoHeight: true,
				maxlength:5000,
				btnWidth: 180,
				options: [
					{
						text: '删除',
						style: {
							backgroundColor: '#dd524d'
						}
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
				},
				form: {
					name: '',
					intro: '',
					mobile:'',
					sex: '女',
					sexid:0,
					sexshow:false,
				},
			checkboxList: [
				{
					name: '言情',
					checked: false,
					disabled: false
				},
				{
					name: '武侠',
					checked: false,
					disabled: false
				},
				{
					name: '情感',
					checked: false,
					disabled: false
				}
			],
			radioList: [
				{
					name: '公开',
					disabled: false
				},
				{
					name: '隐藏',
					disabled: false
				}
			],
			radio: '',
			switchVal: false
			}
		},
		onShow() {
			
		},
		onPageScroll(e) {
			this.scrollTop = e.scrollTop;
		},
		methods: {
			confsex:function(e){
				var val = e[0];
				this.form.sex = this.selector[val];
				this.form.sexid =val;
			},
			opensexsel(){
				this.form.sexshow = true;
			},
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
				}
		}
	}
</script>
<style lang="scss">
	.u-body-item {
		display: flex;
		height: auto;
		width: 100%;
		padding-left: 30rpx;
		color: #333;
		.content {
			width: 100%;
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			margin-left: 30rpx;
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
		width: 125rpx;
		flex: 0 0 120rpx;
		height: 160rpx;
		// border-radius: 6rpx;
		margin-left: 15rpx;
	}
	.book-grid-item {
		display: flex;
		flex-direction: column;
		width: auto;
		.image {
			display: flex;
			width: 100%;
			image{
				width: 100%;
				height: 100%;
			}
		}
		.title {
			line-height: 40rpx;
			padding-top: 15rpx;
		}
		.u-book-wrap {//虚线边框
			width: auto;
			height: 250rpx;
			border-width: 1px;
			border-color: #ddd;
			border-style: dashed;
			background-color: rgb(250, 250, 250);
			border-radius: 6px;
		}
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
