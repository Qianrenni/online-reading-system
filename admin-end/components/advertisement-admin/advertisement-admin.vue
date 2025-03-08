<template>
	<view class="container">
		<!-- 操作工具栏 -->
		<view class="toolbar">
			<view class="toolbar-left">
				<button class="btn primary" @click="openAddPopup">
					<uni-icons type="plus" size="16" color="#fff" /> 添加广告
				</button>
				<button class="btn danger" @click="batchDelete">
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
					<uni-th>广告名称</uni-th>
					<uni-th>描述</uni-th>
					<uni-th>时长（秒）</uni-th>
					<uni-th>奖励金额</uni-th>
					<uni-th>是否启用</uni-th>
					<!-- <uni-th>创建时间</uni-th> -->
					<uni-th align="center">操作</uni-th>
				</uni-tr>
				<uni-tr v-for="item in paginatedData" :key="item.ad_id">
					<uni-td>{{ item.name }}</uni-td>
					<uni-td class="ellipsis">{{ item.description || '无' }}</uni-td>
					<uni-td>{{ item.duration }} 秒</uni-td>
					<uni-td>{{ item.reward }} 书币</uni-td>
					<uni-td>{{ item.is_active ? '启用中' : '已禁用' }}</uni-td>
					<!-- <uni-td>{{ item.created_at }}</uni-td> -->
					<uni-td align="center">
						<view class="action-group">
							<text class="action edit" @click="openEditPopup(item)">编辑</text>
							<text class="action delete" @click="handleDelete(item)">删除</text>
							<text class="action delete" @click="previewVideo(item)">预览</text>
						</view>
					</uni-td>
				</uni-tr>
			</uni-table>
		</view>
		<!-- 分页 -->
		<uni-pagination class="pagination" :page-size="pageSize" :current="pageCurrent" :total="total"
			@change="handlePageChange" />

		<!-- 添加弹窗 -->
		<uni-popup ref="editPopup" type="dialog">
			<view style="width: 55vw;background-color:beige;padding: 50rpx;
				border-radius: 30rpx;
				">
				<view style="width: 100%;display: flex;justify-content: flex-end;">
					<uni-icons type="closeempty" size="28"
						style="background-color: #ddd;border-radius: 14px; margin-bottom: 20px;"
						@click="closeEdit"></uni-icons>
				</view>
				<uni-forms :model="formData">
					<uni-forms-item label="广告名称" label-width="100" required>
						<uni-easyinput v-model="formData.name" />
					</uni-forms-item>
					<uni-forms-item label="描述">
						<uni-easyinput v-model="formData.description" />
					</uni-forms-item>
					<uni-forms-item label="时长（秒）" label-width="100" required>
						<uni-easyinput type="number" v-model="formData.duration" />
					</uni-forms-item>
					<uni-forms-item label="奖励金额" label-width="100" required>
						<uni-easyinput type="number" v-model="formData.reward" />
					</uni-forms-item>
					<uni-forms-item label="是否启用">
						<switch :checked="formData.is_active" @change="(e)=>formData.is_active=e.detail.value" />
					</uni-forms-item>
					<uni-forms-item label="视频文件">
						<uni-file-picker file-mediatype="video" limit="1" ref="file"
						 @select="(event)=>{formData.video_url = event.tempFilePaths[0];}"
						 />
					</uni-forms-item>
				</uni-forms>
				<view style="display: flex;justify-content: center;">
					<button type="primary" @click="confirmEdit">确认更改</button>
				</view>
			</view>
		</uni-popup>
		<!-- 编辑弹窗 -->
		<!-- <uni-popup ref="editPopup" type="dialog">
			<uni-popup-dialog mode="base" title="编辑广告" :before-close="true" @confirm="confirmEdit" @close="closeEdit">
				<uni-forms :model="formData">
					<uni-forms-item label="广告名称" required>
						<uni-easyinput v-model="formData.name" />
					</uni-forms-item>
					<uni-forms-item label="描述">
						<uni-easyinput v-model="formData.description" />
					</uni-forms-item>
					<uni-forms-item label="时长（秒）" required>
						<uni-easyinput type="number" v-model="formData.duration" />
					</uni-forms-item>
					<uni-forms-item label="奖励金额" required>
						<uni-easyinput type="number" v-model="formData.reward" />
					</uni-forms-item>
					<uni-forms-item label="是否启用">
						<switch  :checked="formData.is_active"  @change="(e)=>formData.is_active=e.detail.value"/>
					</uni-forms-item>
					<uni-forms-item label="视频文件">
						<uni-file-picker  file-mediatype="video" limit="1" ref="file" />
					</uni-forms-item>
				</uni-forms>
			</uni-popup-dialog>
		</uni-popup> -->
		<!-- 添加弹窗 -->
		<uni-popup ref="addPopup" type="dialog">
			<view style="width: 55vw;background-color:beige;padding: 50rpx;
			border-radius: 30rpx;
			">
				<view style="width: 100%;display: flex;justify-content: flex-end;">
					<uni-icons type="closeempty" size="28"
						style="background-color: #ddd;border-radius: 14px; margin-bottom: 20px;"
						@click="closeAdd"></uni-icons>
				</view>
				<uni-forms :model="newAd">
					<uni-forms-item label="广告名称" label-width="100" required>
						<uni-easyinput v-model="newAd.name" />
					</uni-forms-item>
					<uni-forms-item label="描述">
						<uni-easyinput v-model="newAd.description" type="textarea" />
					</uni-forms-item>
					<uni-forms-item label="时长（秒）" label-width="100" required>
						<uni-easyinput type="number" v-model="newAd.duration" />
					</uni-forms-item>
					<uni-forms-item label="奖励金额" label-width="100" required>
						<uni-easyinput type="number" v-model="newAd.reward" />
					</uni-forms-item>
					<uni-forms-item label="是否启用">
						<switch :checked="newAd.is_active" @change="(e)=>newAd.is_active=e.detail.value" />
					</uni-forms-item>
					<uni-forms-item label="视频文件">
						<uni-file-picker file-mediatype="video" limit="1" ref="file" @select="handleFileUpload" />
					</uni-forms-item>
				</uni-forms>
				<view style="display: flex;justify-content: center;">
					<button type="primary" @click="confirmAdd">确认添加</button>
				</view>
			</view>
		</uni-popup>
		<view 
		v-if="videoShow"
		style="position: fixed;top: 10vh; left: 15vw;padding: 10px;border: 1px black solid;
		background-color: white;display: flex;flex-direction: column;border-radius: 15px;
		">
			<view style="display: flex;justify-content: flex-end;">
				<uni-icons type="closeempty" size="30" style="color: beige;
				background-color:#242424;border-radius: 15px;cursor: pointer;margin: 5px;" @click="videoShow=false" />
			</view>

			<video :src="videoSrc" style="width: 60vw;height: 70vh;" >

			</video>
		</view>
	</view>
</template>
<script>
	import store from '../../store';
	export default {
		// props: {
		//     initialData: {
		//         type: Array,
		//         default: () => [],
		//     },
		// },
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
				newAd: {
					name: "",
					description: "",
					duration: 0,
					reward: 0,
					is_active: true,
					video_file: null, // 新增：视频文件
				},
				tableData: [],
				videoSrc: '',
				videoShow: false
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
			previewVideo(item) {
				this.videoShow = true;
				this.videoSrc=item.video_url

			},
			handleFileUpload(event) {
				this.newAd.video_file = event.tempFilePaths[0];
			},
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
				this.pageCurrent = 1;
				this.tableData = this.initialData.filter((item) =>
					item.name.includes(this.searchKeyword)
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
			async confirmEdit() {
			    try {
			        // 检查是否有视频文件需要上传
			        if (!this.formData.video_url) {
			            uni.showToast({
			                title: '请上传视频文件',
			                icon: 'none'
			            });
			            return;
			        }
			
			        // 判断 video_url 是否以 BaseUrl 开头，决定是否上传新文件
			        let filePath = null; // 默认不上传文件
			        if (!this.formData.video_url.startsWith(this.$store.state.BaseUrl)) {
			            filePath = this.formData.video_url; // 如果不是以 BaseUrl 开头，则上传新文件
			        }
			
			        // 使用 uni.uploadFile 上传视频文件，并携带其他 formData 数据
			        const uploadResult = await new Promise((resolve, reject) => {
			            uni.uploadFile({
			                url: `${this.$store.state.BaseUrl}/admin/advertisement/update`, // 替换为实际的更新接口地址
			                filePath: filePath, // 根据条件设置 filePath
			                name: 'video', // 后端接收文件的字段名
			                formData: { // 将其他字段附加到 formData 中
			                    ad_id: this.formData.ad_id,
			                    name: this.formData.name,
			                    description: this.formData.description,
			                    duration: this.formData.duration,
			                    reward: this.formData.reward,
			                    is_active: this.formData.is_active ? 'true' : 'false', // 确保布尔值转换为字符串
			                },
			                success: (res) => {
			                    const data = JSON.parse(res.data); // 假设后端返回的是 JSON 格式
			                    if (data.success) {
			                        resolve(data); // 返回后端响应
			                    } else {
			                        reject(new Error(data.message || '上传失败'));
			                    }
			                },
			                fail: (err) => {
			                    reject(new Error('上传失败，请重试'));
			                }
			            });
			        });
					if(!uploadResult.success){
						
						uni.showToast({
						    title: '编辑失败!',
						    icon: 'error'
						});
						this.formData={};
						return ;
					}
			        // 提示编辑成功
			        uni.showToast({
			            title: '编辑成功!',
			            icon: 'success'
			        });
			
			        // 更新本地数据
			        const index = this.tableData.findIndex(
			            (ad) => ad.ad_id === this.formData.ad_id
			        );
			        if (index !== -1) {
			            this.tableData.splice(index, 1, {
			                ...this.formData,
			                video_url: uploadResult.video_url || this.formData.video_url // 如果后端返回了新的文件 URL，则使用新 URL；否则保留旧 URL
			            });
			        }
			
			        // 关闭弹窗
			        this.$refs.editPopup.close();
			    } catch (error) {
			        console.error('Error updating advertisement:', error);
			        uni.showToast({
			            title: '编辑失败，请重试',
			            icon: 'none'
			        });
			    }
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
			async confirmAdd() {
				// 验证表单字段
				if (!this.validateFields(this.newAd)) {
					return;
				}

				try {
					// 调用 uni.uploadFile 上传广告数据和视频文件
					uni.uploadFile({
						url: `${store.state.BaseUrl}/admin/advertisement/add`, // 后端接口地址
						filePath: this.newAd.video_file, // 视频文件路径
						name: 'video_file', // 后端接收文件的字段名
						formData: {
							name: this.newAd.name, // 广告名称
							description: this.newAd.description || '', // 描述（可选）
							duration: this.newAd.duration, // 时长（秒）
							reward: this.newAd.reward, // 奖励金额
							is_active: this.newAd.is_active, // 是否启用（布尔值转数字）
						},
						success: (res) => {
							res = JSON.parse(res.data);
							if (res.success) {
								uni.showToast({
									title: '添加成功!',
									icon: 'success'
								});

								// 更新本地数据
								this.tableData.unshift({
									...this.newAd,
									ad_id: res.ad_id,
									video_url:res.video_url
								});
								this.total = this.tableData.length;

								// 清空表单数据并关闭弹窗
								this.resetForm();
							} else {
								uni.showToast({
									title: `添加失败: ${res.message || '未知错误'}`,
									icon: 'none'
								});
							}
						},
						fail: (error) => {
							uni.showToast({
								title: `上传失败: ${error.errMsg}`,
								icon: 'none'
							});
						},
					});
				} catch (error) {
					console.error('Error adding advertisement:', error);
					uni.showToast({
						title: '添加失败，请重试',
						icon: 'none'
					});
				}
			},

			// 表单验证方法
			validateFields(item) {
				if (!item.name) {
					uni.showToast({
						title: '请填写广告名称',
						icon: 'none'
					});
					return false;
				}
				if (!item.duration || item.duration <= 0) {
					uni.showToast({
						title: '请填写有效的时长',
						icon: 'none'
					});
					return false;
				}
				if (!item.reward || item.reward <= 0) {
					uni.showToast({
						title: '请填写有效的奖励金额',
						icon: 'none'
					});
					return false;
				}
				if (!item.video_file) {
					uni.showToast({
						title: '请上传视频文件',
						icon: 'none'
					});
					return false;
				}
				return true;
			},

			// 清空表单数据并关闭弹窗
			resetForm() {
				this.newAd = {
					name: "",
					description: "",
					duration: 0,
					reward: 0,
					is_active: true,
					video_file: null, // 清空视频文件
				};
				this.$refs.addPopup.close();
			},
			// 关闭添加弹窗
			closeAdd() {
				this.newAd = {
					name: "",
					description: "",
					duration: 0,
					reward: 0,
					is_active: true,
				};
				this.$refs.addPopup.close();
			},
			// 删除操作
			async handleDelete(item) {
				try {
					// 调用 Vuex 的 fetchData 方法删除广告
					const response = await this.$store.dispatch('fetchData', {
						url: `${store.state.BaseUrl}/admin/advertisements/delete`,
						method: "POST",
						data: {
							ad_id: item.ad_id
						},
					});
					if (response.message) {
						uni.showToast({
							title: '删除成功!',
							icon: 'success'
						});
						this.initialData = this.initialData.filter(
							(ad) => ad.ad_id !== item.ad_id
						);
						this.total = this.initialData.length;
					} else {
						uni.showToast({
							title: '删除失败',
							icon: 'error'
						});
					}
				} catch (error) {
					console.error('Error deleting advertisement:', error);
					uni.showToast({
						title: '删除失败，请重试',
						icon: 'none'
					});
				}
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
					content: `确定删除选中的 ${this.selectedItems.length} 条广告吗？`,
					success: async (res) => {
						if (res.confirm) {
							try {
								// 批量删除广告
								await Promise.all(this.selectedItems.map(async (item) => {
									await this.$store.dispatch('fetchData', {
										url: `${store.state.BaseUrl}/admin/advertisements/delete`,
										method: "POST",
										data: {
											ad_id: item.ad_id
										},
									});
								}));
								uni.showToast({
									title: '批量删除成功!',
									icon: 'success'
								});
								this.initialData = this.initialData.filter(
									(ad) => !this.selectedItems.some((selected) => selected.ad_id === ad
										.ad_id)
								);
								this.total = this.initialData.length;
								this.selectedItems = [];
							} catch (error) {
								console.error('Error batch deleting advertisements:', error);
								uni.showToast({
									title: '批量删除失败，请重试',
									icon: 'none'
								});
							}
						}
					},
				});
			},
			async getAdvertisements() {
				try {
					const response = await store.dispatch('fetchData', {
						url: `${store.state.BaseUrl}/admin/advertisement`,
						method: 'GET'
					});
					if (response.advertisements) {
						this.initialData = response.advertisements
					} else {
						uni.showToast({
							title: '加载失败',
							icon: 'error'
						})
					}

				} catch (error) {
					console.log(error);
				}
			}
		},
		created() {
			this.getAdvertisements();
		}
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