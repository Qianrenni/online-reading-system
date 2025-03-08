<script>
	import {
		checkAuth
	} from './utils/router'
	import store from './store'
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// 设置全局页面切换监听器
			let that = this;
			uni.addInterceptor('navigateTo', {
				invoke(args) {

					if (that.checkPageAccess(args.url)) {
						uni.navigateTo({
							url: "/pages/login/index"
						});
						return false;
					}
					return true;
				}
			});
			// 添加请求拦截器
			uni.addInterceptor('request', {
				fail(err) {
					uni.showToast({
						title: '网络错误,请稍后再试!',
						icon: 'error'
					})
				},
				// success(res) {
				// 	console.log('请求成功', res);
				// 	return res;
				// }
			});
		},
		onShow: function() {
			console.log('App Show');
		},
		onHide: function() {
			// this.uploadReadingRecord();
		},
		onUnload() {
			// this.uploadReadingRecord()
		},
		methods: {
			uploadReadingRecord() {
				const readingRecord = this.$store.state.bookAndChapter
				const userId = this.$store.state.userId;
				console.log(userId);
				console.log(readingRecord && userId);
				if (readingRecord && userId) {
					// 假设你有一个API来处理上传的数据
					// 这里应该使用你的实际API路径和参数
					uni.request({
						url: BaseUrl + "/readingrecord/add",
						method: 'POST',
						data: {
							userId: userId, // 获取用户ID的方法
							books: readingRecord,
							readingDevice: uni.getSystemInfoSync().deviceModel
						},
						success: (res) => {
							console.log('Upload success:', res);
						},
						fail: (err) => {
							console.error('Upload failed:', err);
						}
					});
					console.log("上传阅读记录", readingRecord);
				}

			},
			checkPageAccess(path) {
				// 确保路径以斜杠开头
				return !checkAuth({
					path
				});
			}
		}
	}
</script>
<style lang="scss">
	@import "uview-ui/index.scss";
</style>
<style>
	@import "./static/icon/iconfont.css";
	@import '/static/css/animation.css';
	@import '/foui.css';
	/*每个页面公共css */

	/* 
	.page{
		background: linear-gradient(to bottom, #ffcccc, #ccffff);
	} */
	.page-wrap {
		min-height: 100vh;
	}
</style>