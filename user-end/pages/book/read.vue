<template>

	<view :style="{'background-color':bgcolor}" class="page-wrap">
		<uni-nav-bar :backgroundColor="bgcolor2" :title="book.name" left-icon="back" @clickLeft="goback"
			style="font-weight: bold;" :color="fontcolor" :fixed="true" statusBar />
		<swiper @change="(e)=>updateText(e.detail.current+1)" :current="currentChapterId-1" style="padding:0 30rpx;"
			class="page-wrap" @click="click">
			<swiper-item v-for="item in catalog" :key="item.index">

				<scroll-view scroll-y="true" style="height: 100vh;">
					<u-parse v-if="currentChapterId==item.index" :html="text" :selectable="false"
						:show-with-animation="true" :style="{'color':fontcolor,
						'font-size':size,'padding-top':'20rpx','letter-spacing':'2px','line-height':fontheight,
						'letter-spacing':letterSpacing}">
					</u-parse>
				</scroll-view>
			</swiper-item>
		</swiper>

		<!-- 目录 -->
		<uni-popup ref="catalogShow" type="left">
			<view style="max-width: 80vw;">
				<view class="wrap u-border-bottom" :style="{'backgroundColor':bgcolor,'color':fontcolor}"
					style="height: 15vh;display: flex;flex-direction: column;justify-content: space-between;">
					<view class="title">{{ book.name }}</view>
					<view class="author">{{ book.author }}</view>
					<view class="u-flex">
						<view class="status u-row-left">共{{catalog.length}}章</view>
						<view style="position: absolute;right:30rpx;" v-on:click="tabsore">
							<u-icon :label="catalogOrder?'倒序':'正序'" :name="catalogOrder?'daoxu':'zhengxu'"
								color="#2979ff" custom-prefix="icon-book" label-color="#2979ff" size="28"></u-icon>
						</view>
					</view>
				</view>
				<scroll-view scroll-y="true" style="height: 85vh;" :style="{'backgroundColor':bgcolor2}">
					<u-cell-group v-for="item in catalogCopy" :key="item.index">
						<u-cell-item :style="{'backgroundColor':bgcolor2,'color':fontcolor}" :title="item.title"
							@click="goread(item.index)">
						</u-cell-item>
					</u-cell-group>
				</scroll-view>
			</view>

		</uni-popup>
		<!--    <u-popup v-model="sidebar" :safe-area-inset-bottom="false" width="550rpx" z-index="999" >
      
    </u-popup> -->
		<!-- 底部菜单 -->
		<uni-popup type="bottom" ref="settings">
			<view class="u-border-top bottom_set" :style="{'backgroundColor':bgcolor2,'color':fontcolor}">
				<view class="title">{{progress}}% · {{catalog.length>0?catalog[currentChapterId-1].title:''}}</view>
				<view class="u-flex">
					<view class=" u-padding-left-30 u-padding-right-30" @click="updateText(currentChapterId-1)">
						上一章</view>
					<!-- 					<u-slider v-model="progress" active-color="#000000" block-width="35" class="u-flex-5" height="5"
						:max="100" min="1"></u-slider> -->
					<progress :percent="progress" style="flex: 1;" active-color="#000"></progress>
					<view class="u-padding-right-30 u-padding-left-30" @click="updateText(currentChapterId+1)">
						下一章</view>
				</view>
				<u-grid :border="false" :col="3" class="u-padding-top-35 u-padding-bottom-10">
					<u-grid-item style="background:rgba(0,0, 0, 0);" @click="tabside">
						<u-icon :size="46" name="list-dot"></u-icon>
						<view class="grid-text">目录</view>
					</u-grid-item>
					<u-grid-item v-if="night" style="background:rgba(0,0, 0, 0);" @tap="themeChange">
						<u-icon :size="46" custom-prefix="icon-book" name="yejian"></u-icon>
						<view class="grid-text">夜间</view>
					</u-grid-item>
					<u-grid-item v-else style="background:rgba(0,0, 0, 0);" @tap="themeChange">
						<u-icon :size="46" custom-prefix="icon-book" name="rijian"></u-icon>
						<view class="grid-text">日间</view>
					</u-grid-item>
					<u-grid-item style="background:rgba(0,0, 0, 0);" @click="tabsetting">
						<u-icon :size="46" name="setting"></u-icon>
						<view class="grid-text">设置</view>
					</u-grid-item>
				</u-grid>
			</view>
		</uni-popup>

		<uni-popup type="bottom" ref="personalize">
			<view class="u-border-top tabbar_bottoms" :style="{'backgroundColor':bgcolor2,'color':fontcolor}">
				<view class="u-flex u-padding-top-40">
					<view class="u-padding-left-40">左右间距</view>
					<slider block-size="20" active-color="#000" max="1" min="0" step="0.1"
						:value="letterSpacingMultiple" style="flex: 1;" @change="letterSpacingChange"></slider>
				</view>
				<view class="u-flex u-padding-top-40">
					<view class="u-padding-left-40">上下间距</view>
					<slider block-size="20" active-color="#000" max="4" min="2" step="0.1" :value="heightMultiple"
						style="flex: 1;" @change="gapChange"></slider>
				</view>
				<view class="u-flex u-padding-top-40">
					<view class="u-padding-left-40">字号</view>
					<u-button :hair-line="true" :plain="false" hover-class="none" size="medium"
						style="background-color:#F2F2F2;" type="primary" @tap="xiaohao(sizeval)">
						<u-icon :size="sizeval" color="#000000" custom-prefix="icon-book" name="zitisuoxiao"></u-icon>
					</u-button>
					<view>{{ sizeval }}</view>
					<u-button :hair-line="true" :plain="false" hover-class="none" size="medium"
						style="background-color:#F2F2F2;" type="primary" @tap="dahao(sizeval)">
						<u-icon :size="sizeval" color="#000000" custom-prefix="icon-book" name="zitifangda"></u-icon>
					</u-button>
				</view>
				<view class="u-flex u-padding-top-40">
					<view class="u-padding-left-40">主题</view>
					<view class="u-flex u-padding-left-55">
						<view v-for="(theme, index) in themes" :key="index" :id="'theme-' + theme.id"
							class="theme u-margin-right-55" :class="{ 'theme_active': activeTheme === theme.id }"
							:style="{ backgroundColor: theme.bgcolor }" @click="setActiveTheme(theme)">
							<!-- 可选：显示主题预览内容 -->
						</view>
					</view>
				</view>
			</view>
		</uni-popup>

	</view>
</template>

<script>
	import {
		theme
	} from "../../configJs/theme";
	import store from "../../store";
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				theme: theme,
				book: {},
				themes: [{
						"id": "default",
						"bgcolor": "#FFF9E6", // 更柔和的浅黄色背景
						"fontcolor": "#333333" // 更深一点的文字颜色，提升对比度
					},
					{
						"id": "warm",
						"bgcolor": "#F5E9D8", // 更温暖的米黄色背景
						"fontcolor": "#3A3A3A" // 稍深的灰色文字，增强可读性
					},
					{
						"id": "dark",
						"bgcolor": "#121212", // 更深的背景，减少屏幕亮度
						"fontcolor": "#F5F5F5" // 更亮的文字颜色，提升夜间阅读体验
					},
					{
						"id": "ocean",
						"bgcolor": "#E0F2F7", // 更柔和的浅蓝色背景
						"fontcolor": "#005A4E" // 更深的蓝绿色文字，增强对比度
					},
					{
						"id": "forest",
						"bgcolor": "#E6F4E6", // 更清新的浅绿色背景
						"fontcolor": "#1A4D1A" // 更深的绿色文字，提升清晰度
					}
				],
				// 当前激活的主题ID
				list: [{
						name: '目录'
					}
					// ,
					//       {
					//         name: '书签'
					//       }
				],
				text: "",
				currentChapterId: 1,
				debunce: null,
				cache: {},
			}
		},
		methods: {
			themeChange() {
				theme.change();
				store.commit('updateReadTheme', {
					activeTheme: 'default',
					bgcolor: theme.currentTheme.backgroundColors[0],
					fontcolor: theme.currentTheme.foregroundColors[0],
					bgcolor2: theme.currentTheme.backgroundColors[1],
					night: !this.night,
				});
				if (theme.flag) {
					// #ifdef H5
					// 发送一条消息到父窗口
					window.parent.postMessage('black', 'http://localhost:8080');
					// #endif
				} else {
					// #ifdef H5
					// 发送一条消息到父窗口
					window.parent.postMessage('white', 'http://localhost:8080');
					// #endif
				}
			},
			setActiveTheme(theme) {
				// 更新激活的主题
				store.commit('updateReadTheme', {
					activeTheme: theme.id,
					bgcolor: theme.bgcolor,
					fontcolor: theme.fontcolor,
					bgcolor2: theme.bgcolor,
					night: theme.bgcolor !== "#000000",
				});

				// 如果有其他逻辑需要执行，可以在这里继续添加
			},
			dahao(num) {
				console.log(num);
				if (num >= 55) {
					return;
				}
				store.commit('updateFontSetting', {
					heightMultiple: this.heightMultiple,
					letterSpacingMultiple: this.letterSpacingMultiple,
					fontsize: num + 5,
				});
			},
			xiaohao(num) {
				console.log(num);
				if (num <= 15) {
					return;
				}
				store.commit('updateFontSetting', {
					heightMultiple: this.heightMultiple,
					letterSpacingMultiple: this.letterSpacingMultiple,
					fontsize: num - 5,
				});
			},
			click() {
				// this.botton_card = !this.botton_card;
				this.$refs.settings.open();
			},
			able() {
				console.log('点击了遮罩层')
			},
			tabside() {
				this.$refs.settings.close();
				this.$refs.catalogShow.open();
			},

			tabsetting() {
				this.$refs.settings.close();
				this.$refs.personalize.open();
			},
			goback() {
				uni.navigateBack();
			},
			updateText(updateChapterId) {
				if (updateChapterId > 0 && updateChapterId <= this.catalog.length) {
					this.currentChapterId = updateChapterId;
					if (!this.checkPuchase()) {
						return;
					}
					// 清除之前的定时器
					if (this.debunce) {
						clearTimeout(this.debunce);
					}

					// 设置新的定时器
					this.debunce = setTimeout(() => {
						this.getChapterContentFromNetWork(); // 调用网络请求
					}, 300); // 延迟 1000 毫秒
				}
			},
			getChapterContentFromNetWork() {
				if (this.catalog.length <= 0) {
					return;
				}
				if (this.cache[this.currentChapterId]) {
					this.text = this.cache[this.currentChapterId];
					return;
				}
				this.text = "<div></div>";
				let that = this;
				uni.showLoading({});
				uni.request({
					url: this.$store.state.BaseUrl + "/book/read/" + this.book.id + "/page/" + this.catalog[that
						.currentChapterId - 1].href,
					method: "GET",
					success(res) {
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 300
						})
						that.text = res.data.page_content;
						that.cache[that.currentChapterId] = res.data.page_content;
						uni.hideLoading();
					}
				})
			},
			tabsore() {
				this.$store.commit('reverseCatalog');
			},
			goread(chapterId) {
				this.$refs.catalogShow.close();
				this.currentChapterId = chapterId;
				console.log(this.currentChapterId);
				this.tabside()
				if (!this.checkPuchase()) {
					return;
				}
				this.getChapterContentFromNetWork()
			},
			checkPuchase() {
				if (this.book.label) {
					if (this.currentChapterId && this.currentChapterId > this.book.free_pages) {
						if (!this.bookPurchased) {
							this.text = "<div></div>";
							uni.showModal({
								confirmColor: '#dc3545',
								content: "内容需要付费阅读,是否购买?",
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
							return false;
						} else {
							return true;
						}
					} else {
						return true;
					}
				} else {

					return true;
				}
			},
			gapChange(e) {
				// this.heightMultiple = e.detail.value;
				console.log(e.detail.value);
				store.commit('updateFontSetting', {
					heightMultiple: parseFloat(e.detail.value).toFixed(1),
					letterSpacingMultiple: this.letterSpacingMultiple,
					fontsize: this.sizeval,
				});
			},
			letterSpacingChange(e) {
				console.log(e.detail.value);
				store.commit('updateFontSetting', {
					heightMultiple: this.heightMultiple,
					letterSpacingMultiple: parseFloat(e.detail.value).toFixed(1),
					fontsize: this.sizeval,
				});

			}


		},
		computed: {
			letterSpacing() {
				return this.letterSpacingMultiple * this.sizeval + 'rpx';
			},
			fontheight: {
				get() {
					return this.sizeval * this.heightMultiple + 'rpx';
				}
			},
			size() {
				return this.sizeval + 'rpx';
			},
			...mapState({
				catalog: state => state.catalog,
				catalogOrder: state => state.catalogOrder,
				catalogCopy: state => state.catalogCopy,
				bookPurchased: state => state.bookPurchased,
				bgcolor: state => state.readTheme.bgcolor,
				fontcolor: state => state.readTheme.fontcolor,
				bgcolor2: state => state.readTheme.bgcolor2,
				night: state => state.readTheme.night,
				activeTheme: state => state.readTheme.activeTheme,
				heightMultiple: state => state.fontSetting.heightMultiple,
				letterSpacingMultiple: state => state.fontSetting.letterSpacingMultiple,
				sizeval: state => state.fontSetting.fontsize
			}),
			progress: {
				get() {
					if (this.catalog.length > 0) {
						return parseInt(this.currentChapterId * 100 / this.catalog.length);
					} else {
						return 0;
					}

				},
				set(newValue) {

				}
			}
		},
		onLoad() {
			let bookAndChapter = this.$store.state.bookAndChapter;
			this.book = this.$store.state.book;
			this.currentChapterId = bookAndChapter[this.book.id];
			console.log(this.currentChapterId);
			this.getChapterContentFromNetWork()
		},
		beforeDestroy() {
			store.commit('updateBookAndChapter', {
				bookId: this.book.id,
				chapterId: this.currentChapterId
			});
		}
	}
</script>

<style lang="scss" scoped>
	.tabbar_bottoms {
		padding-bottom: 20rpx;
	}

	.theme {
		border-radius: 50%;
		width: 60rpx;
		height: 60rpx;
	}

	.theme_active {
		border-style: solid;

		border-color: black;
		border-width: 5rpx;
	}

	.bottom_set {
		height: auto;

		.title {
			text-align: center;
			padding-top: 20rpx;
			padding-bottom: 20rpx;
		}
	}


	.wrap {
		padding-top: calc(var(--status-bar-height) + 10px);
		padding-left: 30rpx;
		padding-bottom: 20rpx;

		.title {
			font-size: 30rpx;
			font-weight: bold;
		}

		.author {
			font-size: 25rpx;
		}

		.status {
			font-size: 25rpx;
		}
	}
</style>