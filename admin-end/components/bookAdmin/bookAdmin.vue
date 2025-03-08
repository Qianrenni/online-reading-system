<template>
	<view class="container">
		<!-- 操作工具栏 -->
		<view class="toolbar">
			<view class="toolbar-left">
				<button class="btn danger" >
					<uni-icons type="trash" size="16" color="#fff" /> 批量删除
				</button>
			</view>
			<view class="toolbar-right">
				<uni-search-bar style="width: 600rpx;" placeholder="请根据书名,作者,简介,搜索" @input="handleSearch" />
			</view>

		</view>

		<!-- 数据表格 -->
		<view class="table-container">
			<uni-table ref="table" :loading="loading" border stripe type="selection" class="table"
				@selection-change="handleSelectionChange">
				<uni-tr>
					<uni-th>书名</uni-th>
					<uni-th>作者</uni-th>
					<uni-th width="200">简介</uni-th>
					<uni-th>章数</uni-th>
					<uni-th>收费类型</uni-th>
					<uni-th>定价</uni-th>

					<uni-th>免费页数</uni-th>
					<!-- <uni-th >会员免费</uni-th> -->
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="(item,index) in paginatedData" :key="item.id">
					<uni-td class="limit-height">{{ item.name }}</uni-td>
					<uni-td  class="limit-height">{{ item.author }}</uni-td>
					<uni-td class="ellipsis">
						<uni-tooltip :placement="index>pageSize-5?'top':'bottom'">
							<template v-slot:content>
								<text class="tooltip">{{item.desc}}</text>
							</template>
							<view class="ellipsis">{{ truncateText(item.desc,30) }}</view>
						</uni-tooltip>
					</uni-td>

					<uni-td align="center">{{ item.total_pages }}</uni-td>
					<uni-td align="center">{{ item.label ? '收费' : '免费' }}</uni-td>
					<uni-td align="center">{{ item.price }}</uni-td>
					<uni-td align="center">{{ item.free_pages }}</uni-td>
					<!-- <uni-td align="center">{{ item.member_free ? '是' : '否' }}</uni-td> -->
					<uni-td align="center">
						<view class="action-group">
							<text class="action " @click="openEditPopup(item)">字段编辑</text>
							<!-- <text class="action delete" @click="handleDelete(item)">删除</text> -->
							<text class="action " @click="handelEdit(item)">内容编辑</text>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>

		<!-- 分页 -->
		<uni-pagination class="pagination" :page-size="pageSize" :current="pageCurrent" :total="total"
			@change="handlePageChange" />

		<!-- 编辑弹窗 -->
		<uni-popup ref="editPopup" type="center">
			<view style="width: 50vw;background-color:beige;padding: 50rpx;
		border-radius: 30rpx;
		">
				<view style="width: 100%;display: flex;justify-content: flex-end;cursor: pointer;">
					<uni-icons type="closeempty" size="28"
						style="background-color: #ddd;border-radius: 14px; margin-bottom: 20px;"
						@click="closeEdit"></uni-icons>
				</view>
				<uni-forms :model="formData">
					<uni-forms-item label="书名" required>
						<uni-easyinput v-model="formData.name" />
					</uni-forms-item>
					<uni-forms-item label="作者" required>
						<uni-easyinput v-model="formData.author" />
					</uni-forms-item>
					<uni-forms-item label="简介" required>
						<uni-easyinput type="textarea" v-model="formData.desc" />
					</uni-forms-item>
					<uni-forms-item label="种类" required>
						<uni-easyinput v-model="formData.category" />
					</uni-forms-item>
					<uni-forms-item label="收费类型" required>
						<uni-data-checkbox v-model="formData.label" :localdata="freeOptions" />
					</uni-forms-item>
					<uni-forms-item label="定价" v-if="formData.label" required>
						<uni-easyinput v-model="formData.price" />
					</uni-forms-item>
					<uni-forms-item label="免费页数" v-if="formData.label" required>
						<uni-easyinput v-model="formData.free_pages" />
					</uni-forms-item>
				</uni-forms>
				<view style="display: flex;justify-content: center;">
					<button type="primary" @click="confirmEdit">确认修改</button>
				</view>
			</view>
		</uni-popup>

	</view>
</template>
<script>
	import store from '../../store';

	export default {
		data() {
			return {
				initialData: [],
				loading: false,
				searchKeyword: "",
				pageSize: 10,
				pageCurrent: 1,
				total: 0,
				selectedItems: [],
				formData: {},
				tableData: [],
				freeOptions: [{
						value: false,
						text: '免费'
					},
					{
						value: true,
						text: '收费'
					},
				],
				memberFreeOptions: [{
						value: true,
						text: '是'
					},
					{
						value: false,
						text: '否'
					},
				],
				cursor: 0
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
		created() {
			this.network()
		},
		methods: {
			//网络请求
			async network() {
				try {
					// 调用 Vuex 的 fetchData 方法
					const res = await this.$store.dispatch('fetchData', {
						url: this.$store.state.BaseUrl + "/book/books",
						data: {
							cursor: this.cursor,
							count: 10
						},
						method: 'GET',
					});
					if (res.books) {
						this.initialData = [...this.initialData, ...res.books];
						this.cursor = res.cursor
						// console.log(this.initialData);
						if (res.cursor) {
							this.network();
						}
					} else {
						uni.showToast({
							title: '修改失败',
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
			},
			// 表格多选
			handleSelectionChange(e) {
				this.selectedItems = e.detail.index.map((i) => this.tableData[i]);
			},
			truncateText(text, length) {
				if (text.length > length) {
					return text.slice(0, length) + '...';
				}
				return text;
			},
			// 分页变化
			handlePageChange(e) {
				this.pageCurrent = e.current;
			},

			// 搜索e
			handleSearch(e) {
				this.pageCurrent = 1;
				this.searchKeyword = e;
				this.tableData = this.initialData.filter((item) =>
					item.name.includes(this.searchKeyword) ||
					item.author.includes(this.searchKeyword) ||
					item.desc.includes(this.searchKeyword)
				);
				this.total = this.tableData.length;
			},

			// 打开编辑弹窗
			openEditPopup(item) {
				this.formData = {
					...item
				};
				this.$refs.editPopup.open();
			},

			// 确认编辑
			async confirmEdit() {
				try {
					// 调用 Vuex 的 fetchData 方法
					const res = await this.$store.dispatch('fetchData', {
						url: `${store.state.BaseUrl}/admin/books/updatebooks`,
						method: "POST",
						data: {
							bookId: this.formData.id,
							name: this.formData.name,
							author: this.formData.author,
							description: this.formData.desc,
							category: this.formData.category,
							price: this.formData.price,
							is_paid: this.formData.label,
							free_pages: this.formData.free_pages,
						}
					});
					if (res.message) {
						uni.showToast({
							title: '修改成功'
						})
						let tmplist = [...this.initialData];
						const index = tmplist.findIndex(item => item.id === this.formData.id);
						if (index !== -1) {
							this.formData.price = this.formData.is_paid ? this.formData.price : 0.0;
							this.formData.free_pages = this.formData.is_paid ? this.formData.free_pages : 0;
							tmplist[index] = this.formData;
						}
						this.initialData = tmplist;
						this.$refs.editPopup.close();
					} else {
						uni.showToast({
							title: '修改失败',
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
			},

			// 关闭编辑弹窗
			closeEdit() {
				this.formData = {};
				this.$refs.editPopup.close();
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
			handelEdit(item){
				console.log(item);
				store.commit('SET_STATE',{
					key:'book',
					value:item
				});
				uni.navigateTo({
					url:'/pages/previewAndEdit/previewAndEdit'
				})
			}
		},
		onLoad() {

		}
	};
</script>
<style lang="scss" scoped>
	.container {
		padding: 20rpx;
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		text-wrap: nowrap;
		overflow: hidden;
	}
	.limit-height {
	    max-height: 10px;
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
			width: 880rpx;
		}
	}

	.table-container {
		border-radius: 8rpx;
		box-shadow: 0 2rpx 12rpx 0 rgba(0, 0, 0, 0.1);
		.table{
			
		}
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

	.ellipsis {
		white-space: nowrap;
	}
</style>