<template>

	<view class="main-content"
		:style="{'background':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}">
		<StatusBarFill></StatusBarFill>
		<view class="u-flex u-p-l-30 u-p-r-20 " :style="{'background':theme.currentTheme.backgroundColors[1]}">
			<view class="u-m-r-10">
				<u-avatar :src="pic" size="140"></u-avatar>

			</view>
			<view class="u-flex-1">
				<view class="u-font-18 u-p-b-20">{{userName}}</view>
				<view class="u-font-14 u-tips-color">{{userAccount}}</view>
			</view>
			<view class="u-m-l-10 u-p-10">
				<!-- <u-icon name="arrow-right" color="#969799" size="28"></u-icon> -->
				<uni-icons type="gear" size="30" :color="theme.currentTheme.foregroundColors[1]"
					@click="gopage('/pages/user/setting/setting')"></uni-icons>
			</view>
		</view>
		<view class="container" :style="{'background':theme.currentTheme.backgroundColors[1]}">
			<view class="container-text">
				<text>{{userBalance}}</text>
				<text>书币</text>
			</view>
			<u-button class="container-button" type="primary" shape="circle"
				@tap="gopage('/pages/user/recharge')">充值</u-button>
		</view>
		<view class="u-m-t-20">
			<u-cell-group>
				<u-cell-item
					:style="{'background':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
					@tap="gopage('/pages/consumePage/consumePage')" icon="list" title="消费记录">
				</u-cell-item>
				<u-cell-item
					:style="{'background':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
					@tap="gopage('/pages/user/rechargeHistory/rechargeHistory')" icon="list" title="充值记录">
				</u-cell-item>
				<u-cell-item
					:style="{'background':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
					icon="android-fill" @tap="getMobile" title="获取手机版">
				</u-cell-item>
				<u-cell-item
					:style="{'background':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
					icon="gift" @tap="displayAdvertisement" title="看广告得书币">
				</u-cell-item>
				<u-cell-item
					:style="{'background':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
					:arrow="false" title="主题" @tap="changeTheme" v-on:click="theme.change">
					<u-icon custom-prefix="icon-book" :name="themeName" size="46"></u-icon>
				</u-cell-item>
			</u-cell-group>
		</view>
		<view class="u-m-t-20">
			<view style="margin:60rpx;">
				<u-button type="primary" v-if="!this.$store.state.userId" @click="taplogin">登录</u-button>
				<u-button type="primary" v-if="this.$store.state.userId" @click="exitLogin">退出登录</u-button>
			</view>
		</view>
		<view v-if="isvideoshow">
			<uni-icons type="closeempty" size="30" style="position:fixed; top:0; right:40rpx; z-index: 11;margin-top: 48px;color: beige;
			background-color:#242424;border-radius: 15px;cursor: pointer;" @click="closeVedio">
			</uni-icons>
			<view
				style="position:fixed; top:0; left:40rpx; z-index: 11;margin-top: 48px;color: beige;font-size: 36rpx;
			background-color:#242424;border-radius: 18px;width: 36px;height: 36px;display: flex;justify-content: center;align-items: center;">
				{{videotime}}
			</view>
			<video id="hiddenVideoPlayer" :src="videoSrc" :controls="false"
				style="position:fixed; top:0; left:0; width:100%; height:100%;z-index: 10;padding-top: 48px;"
				@loadedmetadata="(e)=>videotime=parseInt(e.detail.duration)" :show-fullscreen-btn="false"></video>
		</view>
		<u-tabbar v-if="!isvideoshow" :bgColor="theme.currentTheme.backgroundColors[1]"
			v-model="this.$store.state.vuex_current" :activeColor="this.$store.state.vuex_activeColor"
			:list="this.$store.state.vuex_tabbar">
		</u-tabbar>
	</view>
</template>

<script>
	import {
		theme
	} from '../../configJs/theme';
	import {
		mapState
	} from 'vuex'
	import store from '../../store';
	export default {
		data() {
			return {
				pic: `/static/image/logo.png`,
				show: true,
				themeName: !theme.flag ? "rijian" : 'yejian',
				theme: theme,
				videoSrc: '', // 替换为实际视频链接
				isvideoshow: false,
				videotime: 100,
				intervalTimer: null,
				ad:null
			}
		},
		computed: {
			...mapState({
				userName: state => state.username,
				userAccount: state => state.useraccount,
				userBalance: state => state.userbalance
			})
		},
		onShow() {
			if (this.$store.state.userpassword && this.$store.state.recharging) {
				let that = this;

				uni.request({
					url: this.$store.state.BaseUrl + '/auth/get_balance',
					method: "POST",
					data: {
						userId: this.$store.state.userId
					},
					success(res) {
						if (res.data.balance) {
							if (parseFloat(res.data.balance) != store.state.userbalance) {
								that.$u.vuex('recharging', false);
							}
							store.commit('updateUserbalance', res.data.balance);


						}
					}
				})
			}
		},
		methods: {
			getMobile(){
				window.open(`${store.state.BaseUrl}/static/uploads/apk/yidu.apk`,'_blank');
			},
			taplogin() {
				uni.navigateTo({
					url: '/pages/login/index'
				});
			},
			gopage: function(url) {
				uni.navigateTo({
					url: url
				})
			},
			changeTheme() {
				theme.change();
			},
			exitLogin() {
				this.$u.vuex("userId", null);
				this.$u.vuex("userbalance", 0);
				this.$u.vuex("username", '游客');
				this.$u.vuex("access_token", '');
				this.$store.commit('updateUseraccount', '游客账号');
				this.$store.commit('updatePassword', '');
			},
			async displayAdvertisement() {
				if(!store.state.userId){
					uni.navigateTo({
						url:'/pages/login/index'
					});
					return ;
				}
				// 显示加载提示
				uni.showLoading({
					title: '加载广告中...'
				});

				// 调用接口获取广告信息
				const response = await this.fetchAd();

				if (!response.success) {
					// 如果没有可用广告或达到观看限制，提示用户
					uni.showToast({
						title: response.message,
						icon: 'none'
					});
					// 隐藏加载提示
					uni.hideLoading();
					return;
				}
				// 获取广告信息
				this.ad = response.ad;
				this.videoSrc=this.ad.video_url
				this.isvideoshow = true; // 显示视频播放器
				setTimeout(() => {
					const videoContext = uni.createVideoContext('hiddenVideoPlayer'); // 获取视频上下文
					videoContext.play(); // 播放视频
				}, 100); // 延迟 100ms 确保视频组件已经渲染完成
				this.intervalTimer = setInterval(() => {
					this.videotime -= 1;
					if (this.videotime <= 0) {
						this.videotime = 0;
						this.closeVedio();
						clearInterval(this.intervalTimer);
						console.log("清除");
					}
				}, 1000);
				// 隐藏加载提示
				uni.hideLoading();
			},
			async fetchAd() {
				try {
					// 调用后端接口获取广告
					const res = await uni.request({
						url: `${this.$store.state.BaseUrl}/ad/watch_ad/${store.state.userId}`, // 替换为实际接口地址
						method: "GET"
					});
				
					if (res[1].data.status === "success") {
						return {
							success: true,
							ad: res[1].data.ad
						};
					} else {
						return {
							success: false,
							message: res[1].data.message || "无法获取广告"
						};
					}
				} catch (error) {
					console.log(error);
					return {
						success: false,
						message: "网络请求失败"
					};
				}
			},
			closeVedio() {
				const videoContext = uni.createVideoContext('hiddenVideoPlayer'); // 获取视频上下文
				clearInterval(this.intervalTimer);
				videoContext.pause();
				let that = this;
				if (this.videotime != 0) {
					uni.showModal({
						title: '提醒',
						content: '未看完完成视频无法获得奖励',
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
								that.isvideoshow = false; // 显示视频播放器
							} else if (res.cancel) {
								console.log('用户点击取消');
								videoContext.play();
								that.intervalTimer = setInterval(() => {
									that.videotime -= 1;
									if (that.videotime <= 0) {
										that.videotime = 0;
										that.closeVedio();
										clearInterval(that.intervalTimer);
										console.log("清除");
									}
								}, 1000);
							}
						}
					})
				} else {
					this.isvideoshow = false; // 显示视频播放器
					this.claimReward();
				}

			},
			async claimReward() {
			        try {
			            // 显示加载提示
			            uni.showLoading({ title: '正在领取奖励...' });
			
			            // 调用后端接口发放奖励
			            const response = await this.fetchReward();
						// 隐藏加载提示
						uni.hideLoading();
			            if (response.status === 'success') {
			                // 更新用户余额
							store.commit('updateUserbalance', response.balance);
			
			                // 提示奖励领取成功
			                uni.showToast({
			                    title: response.message,
			                    icon: 'success'
			                });
			            } else {
			                // 提示错误信息
			                uni.showToast({
			                    title: response.message,
			                    icon: 'none'
			                });
			            }
			        } catch (error) {
			            console.error('Error claiming reward:', error);
			            uni.showToast({
			                title: '领取奖励失败，请重试',
			                icon: 'none'
			            });
			        }finally{

					}
			    },
			
			    fetchReward() {
			        return new Promise((resolve, reject) => {
			            uni.request({
			                url: `${this.$store.state.BaseUrl}/ad/give_reward`, // 替换为实际接口地址
			                method: 'POST',
			                data: {
			                    user_id: this.$store.state.userId, // 当前用户 ID
			                    ad_id: this.ad.ad_id // 当前广告 ID
			                },
			                success: (res) => {
			                    if (res.statusCode === 200 && res.data.status === 'success') {
			                        resolve(res.data); // 返回成功响应
			                    } else {
			                        resolve({
			                            status: 'failed',
			                            message: res.data.message || '奖励发放失败'
			                        });
			                    }
			                },
			                fail: (err) => {
			                    reject(err); // 捕获请求失败的错误
			                }
			            });
			        });
			    }
			
		}
	}
</script>

<style lang="scss" scoped>
	.main-content {
		min-height: 100vh;
		padding: 5% 0 0 0;

		.container {
			margin-top: 20rpx;
			display: flex;
			justify-content: center;
			align-items: center;

			.container-text {
				display: flex;
				margin-left: 10%;
				flex-direction: column;
				text-align: center;

				text:first-child {
					font-size: 28px;

				}

				text:nth-child(2) {
					color: darkgray;

				}
			}

			.container-button {
				margin-right: 10%;
				background-color: red;

			}
		}
	}
</style>