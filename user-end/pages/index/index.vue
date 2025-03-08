<template>
	<view :style="{'background':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}"
		class="page-wrap">
		<StatusBarFill></StatusBarFill>
		<u-icon name="arrow-upward" size="36" color="#007bff" style=
		"width: 50rpx;height: 50rpx; display: flex;justify-content: center;
		position: fixed; bottom: 20vh; right: 3vw;
		border-radius: 25rpx;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影提升立体感 */
		" 
		:style="{'background':theme.currentTheme.backgroundColors[2],cursor: 'pointer'}"
		:color="theme.currentTheme.foregroundColors[0]"
		@click="goToTop"
		/>
		<!-- 搜索框 -->
		<uni-search-bar :bgColor="theme.currentTheme.backgroundColors[2]"
			:textColor="theme.currentTheme.foregroundColors[0]" @input="handleSearchInput"
			@confirm="handleSearchConfirm" placeholder="请输入书名或作者">
		</uni-search-bar>

		<!-- 搜索结果 -->
		<view v-if="searchKeyword">
			<view class="search-result">
				<view v-if="searchResults.length > 0">
					<vertical-list :book="{ list: searchResults }"
						:style="{background:theme.currentTheme.backgroundColors[1],color:theme.currentTheme.foregroundColors[0]}">
					</vertical-list>
				</view>
				<view v-else>
					<text class="u-p-l-60">未找到相关书籍</text>
				</view>
			</view>
		</view>

		<!-- 默认内容 -->
		<view v-else>
			<view class="recommend">
				<view style="display: flex; align-items: center;justify-content: space-between;">
					<view style="display: flex; align-items: center;">
						<uni-icons style="margin-left: 15rpx;" type="heart-filled" size='36' color="red" />
						<view style="font-weight: bold;font-size: 32rpx; margin-left: 10rpx;">猜你喜欢</view>
					</view>
					<view @click="reloadRecommendBooks">
						<uni-icons style="cursor: pointer;" type="reload" size='36' />
					</view>
				</view>
				
				<swiper circular autoplay="true" interval="3500" duration="1000" indicator-dots="true"
					:indicator-color="theme.currentTheme.foregroundColors[1]"
					:indicator-active-color="theme.currentTheme.foregroundColors[2]"
					:style="{'backgroundColor':theme.currentTheme.backgroundColors[1]}">
					<swiper-item v-for="item in recommendBooks" :key="item.id">
						<bookitem :book="item"></bookitem>
					</swiper-item>
				</swiper>
			</view>

			<vertical-list :book="book"
				:style="{background:theme.currentTheme.backgroundColors[1],color:theme.currentTheme.foregroundColors[0]}">
			</vertical-list>
			<uni-load-more :status="status"></uni-load-more>
		</view>

		<u-tabbar :bgColor="theme.currentTheme.backgroundColors[1]" v-model="this.$store.state.vuex_current"
			:activeColor="this.$store.state.vuex_activeColor" :list="this.$store.state.vuex_tabbar">
		</u-tabbar>

	</view>
</template>

<script>
import {
		theme
	} from '../../configJs/theme';
	export default {
		data() {
			return {
				theme: theme,
				status: "more",
				loading: false, // 加载状态
				cursor: 0, // 游标值
				pageSize: 10, // 每次加载的书籍数量
				hasMore: true, // 是否还有更多书籍可加载
				book: {
					showHead: true,
					tit: "好看经典",
					subTit: "24小时热销新书",
					more: true,
					list: this.$store.state.bookList
				},
				searchKeyword: "", // 搜索关键字
				searchResults: [], // 后端返回的搜索结果
				timer: null,
				recommendBooks: [],
				recommendTimer: null,
				goToTopTimer:null,
				fetchBookTimer:null
			}
		},
		methods: {
			// 跳转页面
			goToTop(){
				if(this.goToTopTimer){
					clearTimeout(this.goToTopTimer);
				}
				this.goToTopTimer=setTimeout(()=>{
					uni.pageScrollTo({
						scrollTop:0
					})
				},300);

			},
			gopage: function(url) {
				console.log(url);
				uni.navigateTo({
					url: url
				})
			},
			networkRequest(){
				let that = this;
				uni.request({
					url: this.$store.state.BaseUrl + "/book/books", // 替换为实际的API地址
					method: 'GET',
					data: {
						cursor: this.cursor,
						count: this.pageSize
					},
					success: (response) => {
						let tmpList = that.$store.state.bookList;
						tmpList.push(...response.data.books)
						that.$u.vuex('bookList', tmpList);
						that.cursor = response.data.cursor;
						that.hasMore = !(that.cursor === null);
					},
					fail: (error) => {
						console.error('Failed to fetch books:', error);
					},
					complete: () => {
						that.loading = false;
						that.status = that.hasMore ? "more" : "no-more";
					    uni.stopPullDownRefresh();
					}
				});
			},
			// 加载书籍
			async fetchBooks() {
				if (this.loading || !this.hasMore) {
					return;
				}
				this.loading = true;
				this.status = "loading";
				if(this.fetchBookTimer){
					clearTimeout(this.fetchBookTimer);
				}
				this.fetchBookTimer=setTimeout(()=>{
					this.networkRequest();
				},2500);
			},

			// 处理搜索输入
			handleSearchInput(e) {
				if (this.timer) {
					clearTimeout(this.timer)
				};
				this.timer = setTimeout(() => {
					this.searchKeyword = e;
					this.fetchSearchResults();
				}, 300); // 延迟 300ms
			},

			// 处理搜索确认
			handleSearchConfirm(e) {
				if (this.timer) {
					clearTimeout(this.timer)
				};
				this.timer = setTimeout(() => {
					this.searchKeyword = e.value;
					this.fetchSearchResults();
				}, 300); // 延迟 300ms
			},

			// 调用后端搜索接口
			async fetchSearchResults() {
				if (!this.searchKeyword) {
					this.searchResults = []; // 清空搜索结果
					return;
				}

				this.loading = true;
				let that = this;
				uni.request({
					url: this.$store.state.BaseUrl + "/book/search", // 替换为实际的搜索接口地址
					method: 'GET',
					data: {
						keyword: this.searchKeyword
					},
					success: (response) => {
						that.searchResults = response.data.books; // 更新搜索结果
					},
					fail: (error) => {
						console.error('Failed to fetch search results:', error);
						that.searchResults = [];
					},
					complete: () => {
						that.loading = false;
					}
				});
			},
			reloadRecommendBooks() {
				if (this.recommendTimer) {
					clearTimeout(this.recommendTimer);
				}
				this.recommendTimer = setTimeout(() => {

					let that = this;
					// that.recommendBooks=[]
					uni.request({
						url: `${this.$store.state.BaseUrl}/book/recommend`,
						method: 'POST',
						data: {
							user_id: null
						},
						success(res) {
							if (res.data.recommended_books) {
								that.recommendBooks = res.data.recommended_books;
							}
						}
					})
				}, 500);
			}

		},
		onLoad() {
			this.fetchBooks(); // 页面加载时调用fetchBooks方法加载初始数据
			this.reloadRecommendBooks();

		},
		onReachBottom() {
			this.fetchBooks();
		},
		onPullDownRefresh() {
		   this.fetchBooks();
		  this.reloadRecommendBooks();
		}
	}
</script>

<style>
	.recommend {
		margin: 30rpx 15px;
	}
</style>