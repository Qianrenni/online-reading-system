import {
	createStore
} from 'vuex'
const store = createStore({
	state: {
		BaseUrl: "/api",
		access_token: '',
		book: null
	},
	mutations: {
		// 通用赋值方法
		SET_STATE(state, {
			key,
			value
		}) {
			if (state[key] !== undefined) {
				state[key] = value;
			} else {
				console.warn(`State key "${key}" does not exist.`);
			}
		}
	},
	actions: {
		// 通用网络请求方法
		fetchData({
			state,
			commit
		}, options) {
			return new Promise((resolve, reject) => {
				// 默认请求头
				const defaultOptions = {
					header: {
						...(state.access_token ? {
							Authorization: `Bearer ${state.access_token}`
						} : {})
					}
				};

				// 合并默认配置和传入的 options
				const requestConfig = Object.assign({}, defaultOptions, options);

				// 如果 options.header 存在，则合并默认的 Authorization 到 options.header 中
				if (options.header) {
					requestConfig.header = {
						...options.header,
						...(state.access_token ? {
							Authorization: `Bearer ${state.access_token}`
						} : {})
					};
				} else {
					requestConfig.header = defaultOptions.header;
				}
				// 发起请求
				uni.request({
					...requestConfig,
					success(res) {
						if (res.statusCode === 401) {
							// Token 过期或无效
							uni.showToast({
								title: '登录已过期，请重新登录',
								icon: 'none'
							});
							setTimeout(() => {
								uni.redirectTo({
									url: '/pages/login/login'
								});
							}, 1000);
							reject(new Error('Unauthorized'));
						} else if (res.statusCode >= 200 && res.statusCode < 300) {
							resolve(res.data); // 返回响应数据
						} else {
							reject(new Error(`HTTP Error ${res.statusCode}: ${res.errMsg}`));
						}
					},
					fail(err) {
						reject(err); // 捕获请求失败
					}
				});
			});
		}
	}
})
export default store