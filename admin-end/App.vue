<script>
	import {
		checkAuth
	} from './utils/router';
	export default {
		onLaunch: function() {
			console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch');
			// 拦截 navigateTo
			uni.addInterceptor('navigateTo', {
				invoke(args) {
					if (!checkAuth({
							path: args.url
						})) {
						uni.redirectTo({
							url: "/pages/login/login"
						});
						return false; // 阻止原跳转
					}
					return true; // 允许跳转
				}
			});

			// 拦截 redirectTo
			uni.addInterceptor('redirectTo', {
				invoke(args) {
					if (!checkAuth({
							path: args.url
						})) {
						uni.redirectTo({
							url: "/pages/login/login"
						});
						return false; // 阻止原跳转
					}
					return true; // 允许跳转
				}
			});

			// 拦截 switchTab
			uni.addInterceptor('switchTab', {
				invoke(args) {
					if (!checkAuth({
							path: args.url
						})) {
						uni.showToast({
							title: '请先登录',
							icon: 'none'
						});
						return false; // 阻止原跳转
					}
					return true; // 允许跳转
				}
			});
			// 拦截 switchTab
			uni.addInterceptor('reLaunch', {
				invoke(args) {
					if (!checkAuth({
							path: args.url
						})) {
						uni.showToast({
							title: '请先登录',
							icon: 'none'
						});
						return false; // 阻止原跳转
					}
					return true; // 允许跳转
				}
			});

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import '@/uni_modules/uni-scss/index.scss';
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
</style>