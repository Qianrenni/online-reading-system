<template>
	<view v-if="!ready" class="loading-container">
		<text>加载中...</text>
	</view>
	<view class="dashboard-container" v-if="ready">
		<!-- 第一行：总览指标 -->
		<view class="row">
			<view class="card">
				<view style="display: flex;justify-content: space-between;">
					<view>
						<text>总用户数</text>
						<text class="value">{{ totalUsers.series[0].data }}</text>
					</view>
					<view>
						<text>目标</text>
						<text class="value">{{totalUsers.categories[0].max}}</text>
					</view>
				</view>
				<view class="progress-bar">
					<view :style="{ width: (totalUsers.series[0].data / totalUsers.categories[0].max) * 100 + '%' }">
					</view>
				</view>
				<qiun-data-charts type="line" :chartData="totalUsersTrend" />
			</view>
			<view class="card">
				<view style="display: flex;justify-content: space-between;">
					<view>
						<text>月活用户数</text>
						<text class="value">{{ monthlyActiveUsers.series[0].data }}</text>
					</view>
					<view>
						<text>目标</text>
						<text class="value">{{monthlyActiveUsers.categories[0].max}}</text>
					</view>
				</view>
				<view class="progress-bar">
					<view
						:style="{ width: (monthlyActiveUsers.series[0].data / monthlyActiveUsers.categories[0].max) * 100 + '%' }">
					</view>
				</view>
				<qiun-data-charts type="line" :chartData="monthlyActiveUsersTrend" />
			</view>
			<view class="card">
				<view style="display: flex;justify-content: space-between;">
					<view>
						<text>总收入</text>
						<text class="value">{{totalRevenue.series[0].data }}</text>
					</view>
					<view>
						<text>目标</text>
						<text class="value">{{totalRevenue.categories[0].max}}</text>
					</view>
				</view>
				<view class="progress-bar">
					<view
						:style="{ width: (totalRevenue.series[0].data / totalRevenue.categories[0].max) * 100 + '%' }">
					</view>
				</view>
				<qiun-data-charts type="line" :chartData="totalRevenueTrend" />
			</view>
		</view>
		<!-- 第二行：书籍阅读情况 -->
		<view class="row">
			<view class="card ">
				<text>书籍阅读量趋势</text>
				<qiun-data-charts type="line" :chartData="bookReadingTrend" />
			</view>
			<view class="card">
				<text>热门书籍阅读量</text>
				<qiun-data-charts type="bar" :chartData="hotBooksReading" />
			</view>
		</view>
		<!-- 第三行：用户行为分析 -->
		<view class="row">
			<view class="card ">
				<text>用户活跃度分布</text>
				<qiun-data-charts type="bar" :chartData="userActivityDistribution" />
			</view>
			<view class="card">
				<text>用户留存率</text>
				<qiun-data-charts type="line" :chartData="userRetention" />
			</view>
		</view>
		<!-- 第四行：收费情况 -->
		<view class="row">
			<view class="card ">
				<text>收入来源占比</text>
				<qiun-data-charts type="pie" :chartData="revenueSources" />
			</view>
			<view class="card">
				<text>收入增长趋势</text>
				<qiun-data-charts type="line" :chartData="revenueGrowth" />
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 默认数据
				totalUsers: {
					categories: [{
						name: '用户数',
						min: 0,
						max: 10000
					}],
					series: [{
						name: '当前',
						data: 5000
					}]
				},
				totalUsersTrend: {
					categories: ['1月', '2月', '3月', '4月', '5月'],
					series: [{
						name: '总用户数',
						data: [3000, 4000, 4500, 4800, 5000],
						color: '#1890FF'
					}]
				},
				monthlyActiveUsers: {
					categories: [{
						name: '月活',
						min: 0,
						max: 5000
					}],
					series: [{
						name: '当前',
						data: 3000
					}]
				},
				monthlyActiveUsersTrend: {
					categories: ['1月', '2月', '3月', '4月', '5月'],
					series: [{
						name: '月活用户数',
						data: [2000, 2200, 2500, 2800, 3000],
						color: '#2FC25B'
					}]
				},
				totalRevenue: {
					categories: [{
						name: '收入',
						min: 0,
						max: 200000
					}],
					series: [{
						name: '当前',
						data: 100000
					}]
				},
				totalRevenueTrend: {
					categories: ['1月', '2月', '3月', '4月', '5月'],
					series: [{
						name: '总收入',
						data: [50000, 60000, 70000, 80000, 100000],
						color: '#FACC14'
					}]
				},
				bookReadingTrend: {
					categories: ['1月', '2月', '3月', '4月', '5月'],
					series: [{
						name: '阅读量',
						data: [100, 200, 300, 400, 500],
						color: '#87CEEB'
					}]
				},
				hotBooksReading: {
					categories: ['书籍A', '书籍B', '书籍C', '书籍D', '书籍E'],
					series: [{
						name: '阅读量',
						data: [300, 250, 200, 150, 100],
						color: '#FF69B4'
					}]
				},
				userActivityDistribution: {
					categories: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
					series: [{
						name: "活跃度",
						data: [10, 20, 30, 40, 50, 60, 70],
						color: '#FFA07A'
					}]
				},
				userRetention: {
					categories: ['1月', '2月', '3月', '4月', '5月'],
					series: [{
						name: '留存率',
						data: [80, 75, 70, 65, 60],
						color: '#FFD700'
					}]
				},
				revenueSources: {
					categories: ['订阅', '广告', '捐赠'],
					series: [{
							name: '订阅',
							data: 60,
							color: '#1890FF'
						},
						{
							name: '广告',
							data: 30,
							color: '#2FC25B'
						},
						{
							name: '捐赠',
							data: 10,
							color: '#FACC14'
						}
					]
				},
				revenueGrowth: {
					categories: ['1月', '2月', '3月', '4月', '5月'],
					series: [{
						name: '收入',
						data: [20000, 40000, 60000, 80000, 100000],
						color: '#1E90FF'
					}]
				},
				ready: false // 控制页面渲染
			};
		},
		methods: {

			// 更新数据
			async updateData(data) {
				try {
					// 调用 Vuex 的 fetchData 方法
					const data = await this.$store.dispatch('fetchData', {
						url: this.$store.state.BaseUrl + "/admin/dashboard",
						method: "GET",
					});
					this.totalRevenue = data.totalRevenue;
					this.totalRevenueTrend = data.totalRevenueTrend;
					this.totalUsers = data.totalUsers;
					this.totalUsersTrend = data.totalUsersTrend;
					this.hotBooksReading = data.hotBooksReading;
					this.bookReadingTrend = data.bookReadingTrend;
					this.revenueSources = data.revenueSources;;
					this.revenueGrowth = data.revenueGrowth;
					this.userActivityDistribution = data.userActivityDistribution;
					this.userRetention = data.userRetention;
					this.monthlyActiveUsersTrend = data.monthlyActiveUsersTrend;
					this.monthlyActiveUsers = data.monthlyActiveUsers;
					this.ready = true;
				} catch (error) {
					console.error('Error fetching data:', error);
					uni.showToast({
						title: '加载失败，请重试',
						icon: 'none'
					});
				}
		}
	},
	created() {
		this.updateData();

	}
	};
</script>

<style scoped>
	.dashboard-container {
		padding: 20px;
		background-color: #f5f5f5;
	}

	.loading-container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		font-size: 18px;
		color: #666;
	}

	.row {
		display: flex;
		/* justify-content: space-between; */
		margin-bottom: 20px;
		gap: 20rpx;
	}

	.card {
		flex: 1;
		background-color: #fff;
		border-radius: 10px;
		box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
		padding: 20px;
		box-sizing: border-box;
		position: relative;
	}

	.value {
		font-size: 20px;
		font-weight: bold;
		color: #333;
		margin-bottom: 10px;
	}

	.progress-bar {
		width: 100%;
		height: 20px;
		background-color: #e0e0e0;
		border-radius: 10px;
		overflow: hidden;
	}

	.progress-bar view {
		height: 100%;
		background-color: #1890FF;
		transition: width 0.5s ease;
	}

	.qiun-charts {
		width: 100%;
		height: 400px;
	}
</style>