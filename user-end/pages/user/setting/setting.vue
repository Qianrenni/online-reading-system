<template>
	<view
		:style="{'background': theme.currentTheme.backgroundColors[0], 'color': theme.currentTheme.foregroundColors[0]}"
		class="content">
		<!-- 使用 uni-nav-bar 组件 -->
		<uni-nav-bar title="设置" left-icon="back" @clickLeft="goback" :fixed="true" statusBar
			:backgroundColor="theme.currentTheme.backgroundColors[1]" :color="theme.currentTheme.foregroundColors[0]" />
		<!-- 设置表单和其他内容 -->
		<view class="settings-content" :style="{'background': theme.currentTheme.backgroundColors[1]}">
			<!-- 使用 u-cell-group 和 u-cell-item 来创建设置项 -->
			<u-cell-group>
				<!-- 修改昵称 -->
				<u-cell-item title="修改昵称" @click="showNicknameDialog"
					:style="{'background':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}">
				</u-cell-item>
				<!-- 修改密码 -->
				<u-cell-item title="修改密码" @click="showPasswordDialog"
					:style="{'background':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}">
				</u-cell-item>
			</u-cell-group>
		</view>
		<uni-popup ref="passwordPopup" type="center">
			<view :style="{backgroundColor:theme.currentTheme.backgroundColors[1]}"
				style="padding: 15rpx;width: 600rpx;border-radius: 15rpx;">
				<uni-forms ref="passwordForm" :modelValue="formData">
					<!-- 旧密码 -->
					<uni-forms-item label="旧密码" name="oldPassword">
						<uni-easyinput v-model="formData.oldPassword" type="password" placeholder="请输入旧密码"
							maxlength="20"
							:styles="{'backgroundColor': theme.currentTheme.backgroundColors[1], 'color': theme.currentTheme.foregroundColors[0]}" />
					</uni-forms-item>
					<!-- 新密码 -->
					<uni-forms-item label="新密码" name="newPassword">
						<uni-easyinput v-model="formData.newPassword" type="password" placeholder="请输入新密码"
							maxlength="20"
							:styles="{'backgroundColor': theme.currentTheme.backgroundColors[1], 'color': theme.currentTheme.foregroundColors[0]}" />
					</uni-forms-item>
					<!-- 确认新密码 -->
					<uni-forms-item label="确认新密码" label-width="100" name="confirmNewPassword">
						<uni-easyinput v-model="formData.confirmNewPassword" type="password" placeholder="请再次输入新密码"
							maxlength="20"
							:styles="{'backgroundColor': theme.currentTheme.backgroundColors[1], 'color': theme.currentTheme.foregroundColors[0]}" />
					</uni-forms-item>
					<!-- 提交按钮 -->
					<button type="primary" @click="submitPasswordChange">提交</button>
				</uni-forms>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		theme
	} from '../../../configJs/theme';
	import store from '../../../store';
	export default {
		data() {
			return {
				theme: theme,
				formData: {
					oldPassword: '', // 旧密码
					newPassword: '', // 新密码
					confirmNewPassword: '' // 确认新密码
				}
			};
		},
		methods: {
			goback() {
				// 返回上一页逻辑
				uni.navigateBack();
			},
			showNicknameDialog() {
				// 弹出修改昵称对话框
				uni.showModal({
					title: '修改昵称',
					content: '',
					editable: true, // 允许编辑
					placeholderText: '请输入新的昵称',
					success: (res) => {
						if (res.confirm && res.content.trim()) {
							const nickname = res.content.trim();
							try {
								const response = new Promise((resolve, reject) => {
									uni.request({
										url: `${store.state.BaseUrl}/auth/updateusername`,
										method: 'POST',
										data: {
											username: nickname,
										},
										header: {
											Authorization: `Bearer ${store.state.access_token}`,
										},
										success(res) {
											if (res.data.status === 'success') {
												store.commit('updateUsername', nickname);
												uni.showToast({
													title: '昵称修改成功',
													icon: 'success',
												});
											} else {
												uni.showToast({
													title: '修改失败，请稍后重试',
													icon: 'none',
												});
											}
										},
										fail(err) {
											console.error(err);
											uni.showToast({
												title: '网络错误，请检查连接',
												icon: 'none',
											});
										},
									});
								})
							} catch (error) {
								console.log(error);
							}
						} else if (res.confirm) {
							uni.showToast({
								title: '昵称不能为空',
								icon: 'none'
							});
						}
					}
				});
			},
			showPasswordDialog() {
				// 打开修改密码弹窗
				this.$refs.passwordPopup.open();
			},
			submitPasswordChange() {
				// 表单验证逻辑
				if (!this.formData.oldPassword) {
					uni.showToast({
						title: '请输入旧密码',
						icon: 'none'
					});
					return;
				}
				if (!this.formData.newPassword || !this.formData.confirmNewPassword) {
					uni.showToast({
						title: '请输入新密码并确认',
						icon: 'none'
					});
					return;
				}
				if (this.formData.newPassword !== this.formData.confirmNewPassword) {
					uni.showToast({
						title: '两次输入的新密码不一致',
						icon: 'none'
					});
					return;
				}
				let that=this;
				// 发送请求更新密码
				uni.request({
					url: `${store.state.BaseUrl}/auth/changepassword`,
					method: 'POST',
					data: {
						oldPassword: this.formData.oldPassword,
						newPassword: this.formData.newPassword,
					},
					header: {
						Authorization: `Bearer ${store.state.access_token}`,
					},
					success(res) {
						if (res.data.status === 'success') {
							uni.showToast({
								title: '密码修改成功',
								icon: 'success',
							});
							// 关闭弹窗
							that.$refs.passwordPopup.close();
							// 清空表单数据
							that.formData.oldPassword = '';
							that.formData.newPassword = '';
							that.formData.confirmNewPassword = '';
						} else {
							uni.showToast({
								title: '修改失败，请稍后重试',
								icon: 'none',
							});
						}
					},
					fail(err) {
						console.error(err);
						uni.showToast({
							title: '网络错误，请检查连接',
							icon: 'none',
						});
					},
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		min-height: 100vh;
	}

	.settings-content {
		width: 90%;
		font-size: 28rpx;
		margin: 20px 0;
		border: 1px #ddd solid;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		text-align: center;
	}
</style>