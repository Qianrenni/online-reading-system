import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
const deviceModel = uni.getSystemInfoSync().deviceModel;
let readTheme=uni.getStorageSync('readTheme')||{
			activeTheme: 'default',
			bgcolor: '#fffae8',
			fontcolor: '#303133',
			bgcolor2: '#fffae8',
			night: true,
		};
let fontSetting=uni.getStorageSync('fontSetting')||{
			heightMultiple: 2.0,
			letterSpacingMultiple:0,
			fontsize:35
		};
const store = new Vuex.Store({
	state: {
		fontSetting:fontSetting,
		readTheme:readTheme,
		vuex_bookstyle: 'list', // 默认值
		vuex_bookbutton: 'list-dot', // 默认值
		vuex_current: 1,
		vuex_activeColor: '#5098FF',
		vuex_tabbar: [{
				iconPath: "home",
				selectedIconPath: "home-fill",
				text: '书城',
				pagePath: '/pages/index/index'
			},
			{
				iconPath: "bookmark",
				selectedIconPath: "bookmark-fill",
				text: '书架',
				pagePath: '/pages/book/book'
			},
			{
				iconPath: "account",
				selectedIconPath: "account-fill",
				text: '我的',
				pagePath: '/pages/user/user'
			}
		],
		username: '游客', // 用户名
		useraccount: '游客账号', // 用户账号
		userpassword: "", // 新增密码字段
		userbalance: 0, // 用户余额
		access_token: "",
		userId: null,
		book: null,
		bookAndChapter: {},
		catalog: [],
		catalogCopy: [],
		catalogOrder: true,
		BaseUrl: '/api',
		bookList: [],
		recharging: false,
		bookindex: '',
		readingHistory: [],
		deviceModel: deviceModel,
		queryBalanceTimer: null,
		bookPurchased: false,
		onShelfBooks: []
	},
	mutations: {
		updateFontSetting(state,setting){
			state.fontSetting=setting;
			uni.setStorageSync('fontSetting',setting);
		},
		updateReadTheme(state,theme){
			state.readTheme=theme;
			uni.setStorageSync('readTheme',theme);
		},
		reverseCatalog(state) {
			state.catalogCopy.reverse();
			state.catalogOrder = !state.catalogOrder;
		},
		$uStore(state, payload) {
			let nameArr = payload.name.split('.');
			let len = nameArr.length;
			if (len >= 2) {
				let obj = state[nameArr[0]];
				for (let i = 1; i < len - 1; i++) {
					obj = obj[nameArr[i]];
				}
				obj[nameArr[len - 1]] = payload.value;
			} else {
				state[payload.name] = payload.value;
			}
		},
		updateUsername(state, username) {
			state.username = username;
		},
		updateUseraccount(state, useraccount) {
			state.useraccount = useraccount;
			uni.setStorageSync('useraccount', useraccount);
		},
		updatePassword(state, password) {
			state.userpassword = password;
			uni.setStorageSync('userpassword', password);
		},
		updateUserbalance(state, userbalance) {
			state.userbalance = parseFloat(userbalance);
		},
		updateUserId(state, userId) {
			state.userId = userId;
		},
		updateAccessToken(state, access_token) {
			state.access_token = access_token;
		},
		updateBook(state, book) {
			state.book = book;
			state.bookPurchased = false;
		},
		updateCatalog(state, catalog) {
			state.catalog = catalog;
			state.catalogCopy = [...catalog];
		},
		updateBookindex(state, bookindex) {
			state.bookindex = bookindex;
		},
		updateReadingHistory(state, readingHistory) {
			state.readingHistory = readingHistory;
		},
		updateBookAndChapter(state, payload) {
			const {
				bookId,
				chapterId
			} = payload;
			// 使用 bookId 和 chapterId 进行操作
			state.bookAndChapter[bookId] = chapterId;
			let find = false;
			for (let item of state.readingHistory) {
				if (item.id === bookId) {
					item.read = chapterId;
					find = true;
					break;
				}
			}
			for (let item of state.onShelfBooks) {
				if (item.id === bookId) {
					item.read = chapterId;
					break;
				}
			}
			if (!find) {
				state.readingHistory.push({
					...state.bookList.find((item) => item.id === bookId),
					read: chapterId
				});
			}
			console.log("update readinghistory", bookId, chapterId);
			if (state.userId) {
				let books = {};
				books[bookId] = chapterId;
				uni.request({
					url: state.BaseUrl + "/readingrecord/add",
					method: 'POST',
					data: {
						userId: state.userId, // 获取用户ID的方法
						books: books,
						readingDevice: deviceModel
					},
					success: (res) => {
						console.log('Upload success:', res);
						console.log("上传阅读记录", books);
					},
					fail: (err) => {
						console.error('Upload failed:', err);
					}
				});
			}
		},
		updateOnshelf(state,payload){
			for(let item of state.readingHistory){
				if(item.id===payload.id){
					item['onshelf']=payload.flag;
				}
			}
		}
	},
	actions: {
		async removeBookFromShelf({
			state,
			commit
		}, bookId) {
			if (!bookId) {
				return;
			}
			const response = await uni.request({
				url: `${state.BaseUrl}/book/shelf/remove`,
				method: 'POST',
				data: {
					user_id: state.userId,
					book_id: bookId
				}
			})
			if (response[1].data.message) {
				uni.showToast({
					title: "删除成功"
				});
				state.onShelfBooks = state.onShelfBooks.filter((item) => item.id != bookId);
				// for (let item of state.readingHistory) {
				// 	if (item.id === bookId) {
				// 		item['onshelf'] = false;
				// 		break;
				// 	}
				// }
				commit('updateOnshelf',{
					id:bookId,
					flag:false
				});
			} else {
				uni.showToast({
					title: '删除失败'
				});
			}
		},
		async addBookToShelf({
			state,
			commit
		}, book) {
			if (!state.userId) {
				uni.navigateTo({
					url: '/pages/login/index'
				})
				return;
			}
			const response = await uni.request({
				url: `${state.BaseUrl}/book/shelf/add`,
				method: "POST",
				data: {
					user_id: state.userId,
					book_id: book.id
				}
			})
			if (response[1].data.message) {
				uni.showToast({
					title: '添加成功'
				})

				if (!state.bookAndChapter[book.id]) {
					state.bookAndChapter[book.id] = 1;
				}
				state.onShelfBooks.push({
					...book,
					read: state.bookAndChapter[book.id]
				});
				// for (let item of state.readingHistory) {
				// 	if (item.id === book.id) {
				// 		item['onshelf'] = true;
				// 		break;
				// 	}
				// }
				commit('updateOnshelf',{
					id:book.id,
					flag:true
				});

			} else {
				uni.showToast({
					title: '添加失败'
				})
			}
		},
		async fetchBookContents({
			state,
			commit
		}, bookId) {
			try {
				const response = await uni.request({
					url: `${state.BaseUrl}/book/contents/${bookId}`,
					method: 'GET',
					data: {
						id: bookId
					},
				});
				const cataloglist = response[1].data.contents.map((item, index) => ({
					...item,
					index: index + 1,
				}));
				commit('updateCatalog', cataloglist);

				// const pageResponse = await uni.request({
				// 	url: `${state.BaseUrl}/book/read/${bookId}/page/${cataloglist[0].href}`,
				// 	method: 'GET',
				// });
				// commit('updateBookindex', pageResponse[1].data.page_content);
			} catch (error) {
				console.error('Error fetching book contents:', error);
			}
		},
		async autoLogin({
			state,
			commit
		}) {
			const storedAccount = uni.getStorageSync('useraccount');
			const storedPassword = uni.getStorageSync('userpassword');
			state.book = uni.getStorageSync('book');

			if (!storedAccount || !storedPassword) {
				console.log('没有本地登录记录');
				return;
			}

			try {
				const loginResponse = await uni.request({
					url: `${state.BaseUrl}/auth/login`,
					method: 'POST',
					data: {
						email: storedAccount,
						password: storedPassword
					},
				});

				const loginData = loginResponse[1].data;
				if (loginData.access_token) {
					commit('updateUsername', loginData.username);
					commit('updateUserId', loginData.userId);
					commit('updateAccessToken', loginData.access_token);
					commit('updateUserbalance', loginData.balance);
					commit('updatePassword', storedPassword);
					commit('updateUseraccount', storedAccount);
					await this.dispatch('fetchOnShelfBooks', loginData.userId);
					await this.dispatch('fetchReadingHistory', loginData.userId);
				} else {
					console.error('自动登录失败', loginData);
				}
			} catch (err) {
				console.error('自动登录请求失败', err);
			}
		},
		async fetchOnShelfBooks({
			state,
			commit
		}, userId) {
			try {
				const response = await uni.request({
					url: `${state.BaseUrl}/book/shelf`,
					method: 'POST',
					data: {
						user_id: userId
					},
				});
				const shelf = response[1].data.shelf;

				if (shelf) {
					state.onShelfBooks = shelf;
					for (let item of shelf) {
						state.bookAndChapter[item.id] = item.read;
					}
				}

			} catch (err) {
				console.error('Error fetching reading history:', err);
			}
		},
		async fetchReadingHistory({
			state,
			commit
		}, userId) {
			try {
				const response = await uni.request({
					url: `${state.BaseUrl}/readingrecord/get`,
					method: 'POST',
					data: {
						userId: userId
					},
				});

				const historyData = response[1].data.readingHistory;
				commit('updateReadingHistory', historyData);
				if (historyData) {
					for (let item of historyData) {
						if (state.bookAndChapter[item.id]) {
							item['onshelf'] = true;
						} else {
							item['onshelf'] = false;
							state.bookAndChapter[item.id] = item.read;
						}

					}
				}

			} catch (err) {
				console.error('Error fetching reading history:', err);
			}
		},
		async updateBook({
			state,
			commit
		}, book) {
			if (state.bookindex && state.catalog && book && state.book?.id === book.id) {
				return;
			}
			commit('updateBook', book);
			uni.showLoading({});
			await this.dispatch('fetchBookContents', book.id);
			uni.hideLoading();
			this.dispatch('checkBookPurchase');
			uni.setStorageSync("book", book);
			console.log("更新当前书籍", book);
		},
		async checkBookPurchase({
			state,
			commit
		}) {
			if (!state.book.label) {
				return;
			} else {
				if (!state.userId) {
					return;
				}
				try {
					const response = await uni.request({
						url: state.BaseUrl + '/book/has_purchased',
						data: {
							user_id: state.userId,
							book_id: state.book.id
						},
						method: 'POST'
					});

					const res = response[1].data;
					if (res.purchased) {
						commit('$uStore', {
							name: 'bookPurchased',
							value: res.purchased
						});

					} else {

					}
				} catch (error) {
					console.error('检查书籍购买状态失败:', error);
				}
			}
		}
	}
});

// 在应用加载时调用自动登录
store.dispatch('autoLogin');

export default store;