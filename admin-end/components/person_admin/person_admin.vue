<template>
	<view class="container">
		<!-- 操作工具栏 -->
		<view class="toolbar">
			<view class="toolbar-left">
				<button class="btn primary" >
					<uni-icons type="plus" size="16" color="#fff" /> 添加
				</button>
				<button class="btn danger" >
					<uni-icons type="trash" size="16" color="#fff" /> 批量删除
				</button>
			</view>
			<view class="toolbar-right">
				<!-- 修改为带有搜索图标的输入框 -->
				<uni-easyinput class="search-input" suffixIcon="search" v-model="searchKeyword" placeholder="请输入关键词"
					placeholder-style="color: #909399" @iconClick="handleSearch" />
			</view>
		</view>

		<!-- 数据表格 -->
		<view class="table-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection"
				@selection-change="handleSelectionChange">
				<uni-tr>
					<uni-th>账号</uni-th>
					<uni-th>用户名</uni-th>
					<uni-th>余额</uni-th>
					<uni-th>创建时间</uni-th>
					<uni-th>更新时间</uni-th>
					<uni-th>是否封禁</uni-th>
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="item in paginatedData" :key="item.id">
					<uni-td>{{ item.email }}</uni-td>
					<uni-td class="ellipsis">{{ item.username }}</uni-td>
					<uni-td>{{ item.balance }}</uni-td>

					<uni-td>{{ item.created_at }}</uni-td>
					<uni-td>{{ item.updated_at }}</uni-td>
					<uni-td>{{ item.is_active?'活跃':'封禁中' }}</uni-td>
					<uni-td align="center">
						<view class="action-group">
							<text class="action edit" @click="openEditPopup(item)">解封</text>
							<text class="action delete" @click="handleDelete(item)">封禁</text>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>

		<!-- 分页 -->
		<uni-pagination class="pagination" :page-size="pageSize" :current="pageCurrent" :total="total"
			@change="handlePageChange" />

		<!-- 编辑弹窗 -->
		<uni-popup ref="editPopup" type="dialog">
			<uni-popup-dialog mode="base" title="编辑信息" :before-close="true" @confirm="confirmEdit" @close="closeEdit">
				<uni-forms :model="formData">
					<uni-forms-item label="账号" required>
						<uni-easyinput v-model="formData.user_num" />
					</uni-forms-item>
					<uni-forms-item label="密码" required>
						<uni-easyinput type="password" v-model="formData.user_pass" />
					</uni-forms-item>
					<uni-forms-item label="注册时间">
						<uni-datetime-picker v-model="formData.add_time" />
					</uni-forms-item>
				</uni-forms>
			</uni-popup-dialog>
		</uni-popup>

		<!-- 添加弹窗 -->
		<uni-popup ref="addPopup" type="dialog">
			<uni-popup-dialog mode="base" title="添加用户" @confirm="confirmAdd" @close="closeAdd">
				<uni-forms :model="newUser">
					<uni-forms-item label="账号" required>
						<uni-easyinput v-model="newUser.user_num" />
					</uni-forms-item>
					<uni-forms-item label="密码" required>
						<uni-easyinput type="password" v-model="newUser.user_pass" />
					</uni-forms-item>
				</uni-forms>
			</uni-popup-dialog>
		</uni-popup>
	</view>
</template>
<script>
	import store from '../../store';

	export default {
		props: {
			initialData: {
				type: Array,
				default: () => [],
			},
		},
		data() {
			return {
				loading: false,
				searchKeyword: "",
				pageSize: 10,
				pageCurrent: 1,
				total: 0,
				selectedItems: [],
				formData: {},
				newUser: {
					user_num: "",
					user_pass: "",
				},
				tableData: [],
			};
		},
		computed: {
			// 分页数据
			paginatedData() {
				const start = (this.pageCurrent - 1) * this.pageSize;
				const end = start + this.pageSize;
				return this.tableData.slice(start, end);
			},
		},
		watch: {
			initialData: {
				immediate: true,
				handler(val) {
					this.tableData = [...val];
					this.total = val.length;
				},
			},
		},
		methods: {
			// 表格多选
			handleSelectionChange(e) {
				this.selectedItems = e.detail.index.map((i) => this.tableData[i]);
			},

			// 分页变化
			handlePageChange(e) {
				this.pageCurrent = e.current;
			},

			// 搜索
			handleSearch() {
				uni.showToast({
					title: `搜索`,
					icon: 'none'
				});
				this.pageCurrent = 1;
				this.tableData = this.initialData.filter((item) =>
					item.user_num.includes(this.searchKeyword)
				);
				this.total = this.tableData.length;
			},

			// 打开编辑弹窗
			async openEditPopup(item) {
				if (!item || item.is_active) {
					return;
				}
				try {

					// 调用 Vuex 的 fetchData 方法
					const response = await this.$store.dispatch('fetchData', {
						url: `${store.state.BaseUrl}/admin/users/enableuser`,
						method: "POST",
						data: {
							userId: item.user_id
						}
					});
					if (response.message) {
						uni.showToast({
							title: '解封成功!',
							icon: 'success'
						});
						item.is_active = true;
					} else {
						uni.showToast({
							title: '解封失败'
						})
					}
				} catch (error) {
					console.error('Error fetching data:', error);
					uni.showToast({
						title: '加载失败，请重试',
						icon: 'none'
					});
				}
			},

			// 确认编辑
			confirmEdit() {
				const index = this.tableData.findIndex(
					(item) => item.id === this.formData.id
				);
				if (index !== -1) {
					this.tableData.splice(index, 1, {
						...this.formData
					});
				}
				this.$refs.editPopup.close();
			},

			// 关闭编辑弹窗
			closeEdit() {
				this.formData = {};
				this.$refs.editPopup.close();
			},

			// 打开添加弹窗
			openAddPopup() {
				this.$refs.addPopup.open();
			},

			// 确认添加
			confirmAdd() {
				const newId = this.tableData.length ?
					Math.max(...this.tableData.map((item) => item.id)) + 1 :
					1;
				this.tableData.unshift({
					id: newId,
					user_num: this.newUser.user_num,
					user_pass: this.newUser.user_pass,
					add_time: new Date().toLocaleString(),
				});
				this.total = this.tableData.length;
				this.newUser = {
					user_num: "",
					user_pass: ""
				};
				this.$refs.addPopup.close();
			},

			// 关闭添加弹窗
			closeAdd() {
				this.newUser = {
					user_num: "",
					user_pass: ""
				};
				this.$refs.addPopup.close();
			},

			// 删除操作
			async handleDelete(item) {
				if (!item || !item.is_active) {
					return;
				}
				try {

					// 调用 Vuex 的 fetchData 方法
					const response = await this.$store.dispatch('fetchData', {
						url: `${store.state.BaseUrl}/admin/users/disableuser`,
						method: "POST",
						data: {
							userId: item.user_id
						},
					});
					if (response.message) {
						uni.showToast({
							title: '封禁成功!',
							icon: 'success'
						});
						item.is_active = false;
					} else {
						uni.showToast({
							title: '封禁失败',
							icon: 'error'
						})
					}
				} catch (error) {
					console.error('Error fetching data:', error);
					uni.showToast({
						title: '加载失败，请重试',
						icon: 'none'
					});
				}

				// uni.showModal({
				// 	title: "确认删除",
				// 	content: `确定删除用户 ${item.user_num} 吗？`,
				// 	success: (res) => {
				// 		if (res.confirm) {
				// 			this.tableData = this.tableData.filter(
				// 				(data) => data.id !== item.id
				// 			);
				// 			this.total = this.tableData.length;
				// 		}
				// 	},
				// });
			},

			// 批量删除
			batchDelete() {
				if (this.selectedItems.length === 0) {
					return uni.showToast({
						title: "请先选择要删除的项",
						icon: "none"
					});
				}
				uni.showModal({
					title: "确认删除",
					content: `确定删除选中的 ${this.selectedItems.length} 项吗？`,
					success: (res) => {
						if (res.confirm) {
							this.tableData = this.tableData.filter(
								(item) => !this.selectedItems.includes(item)
							);
							this.total = this.tableData.length;
							this.selectedItems = [];
						}
					},
				});
			},
		},
	};
</script>

<style lang="scss" scoped>
	.container {
		padding: 20rpx;
		background-color: #f5f7fa;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.toolbar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		background-color: #fff;
		margin-bottom: 20rpx;
		border-radius: 8rpx;
		box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1);

		.toolbar-left {
			display: flex;
			gap: 15rpx;
		}

		.toolbar-right {
			display: flex;
			gap: 15rpx;
			align-items: center;
		}

		.btn {
			display: inline-flex;
			align-items: center;
			padding: 8rpx 16rpx;
			border-radius: 4rpx;
			font-size: 28rpx;

			&.primary {
				background-color: #1890ff;
				color: white;
			}

			&.danger {
				background-color: #ff4d4f;
				color: white;
			}
		}

		.search-input {
			width: 300rpx;
		}
	}

	.table-container {

		border-radius: 8rpx;
		box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1);
	}

	.action-group {
		display: flex;
		gap: 20rpx;
		justify-content: center;

		.action {
			color: #1890ff;
			cursor: pointer;
			&:hover {
				color: #ff4d4f;
			}
		}
	}

	.pagination {
		margin-top: 20rpx;
		justify-content: center;
	}

	::v-deep .uni-table-th {
		background-color: #fafafa;
	}

	.ellipsis {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>