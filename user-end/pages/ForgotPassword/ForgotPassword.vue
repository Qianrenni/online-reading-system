<template>
  <view :style="{'background':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}" class="content">
    <!-- 使用 uni-nav-bar 组件 -->
    <uni-nav-bar 
      title="忘记密码" 
      left-icon="back" 
      @clickLeft="goback" 
      :fixed="true"
      statusBar
      :backgroundColor="theme.currentTheme.backgroundColors[1]"
      :color="theme.currentTheme.foregroundColors[0]"
    />

    <!-- 忘记密码表单和其他内容 -->
    <view class="t-forgot" :style="{'background':theme.currentTheme.backgroundColors[1]}">
      <!-- 标题 -->
      <view class="t-b">{{ title }}</view>

      <!-- 使用 uni-forms 组件 -->
      <uni-forms ref="forgotForm" :modelValue="formData">
        <!-- 邮箱 -->
        <uni-forms-item label="" name="email">
          <uni-easyinput v-model="formData.email" placeholder="请输入您的邮箱" maxlength="50" 
            :styles="{'backgroundColor':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
          />
        </uni-forms-item>

        <!-- 提交按钮 -->
        <button type="primary" @click="sendResetLink">发送重置链接</button>
      </uni-forms>
    </view>
  </view>
</template>

<script>
import store from '../../store';
import { theme } from '../../configJs/theme';

export default {
  data() {
    return {
      theme: theme,
      title: '找回密码',
      formData: {
        email: ''
      }
    };
  },
  methods: {
    goback() {
      uni.navigateBack();
    },
    sendResetLink() {
      if (!this.formData.email) {
        uni.showToast({
          title: '请输入邮箱',
          icon: 'none'
        });
        return;
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.formData.email)) {
        uni.showToast({
          title: '请输入正确的邮箱格式',
          icon: 'none'
        });
        return;
      }

      uni.request({
        url: this.$store.state.BaseUrl + "/auth/forgot-password",
        method: 'POST',
        data: {
          email: this.formData.email
        },
        success(response) {
          if (response.data.status === 'success') {
            uni.showToast({
              title: '重置链接已发送，请检查您的邮箱',
              icon: 'none'
            });
          } else {
            uni.showToast({
              title: '发送失败，请稍后再试或联系管理员',
              icon: 'none'
            });
          }
        },
        fail() {
          uni.showToast({
            title: '网络请求失败，请稍后再试',
            icon: 'none'
          });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column; /* 确保子元素垂直排列 */
  align-items: center; /* 水平居中对齐 */
  justify-content: flex-start; /* 内容从顶部开始 */
  min-height: 100vh; /* 使用最小高度为视口高度 */
}

.t-forgot {
  width: 600rpx;
  margin: auto 0;
  font-size: 28rpx;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center; /* 使文本内容居中 */
}

.t-forgot button {
  font-size: 28rpx;
  height: 90rpx;
  line-height: 90rpx;
  border-radius: 50rpx;
  box-shadow: 0 5px 7px 0 rgba(86, 119, 252, 0.2);
  margin-top: 20px;
  width: 80%; /* 让按钮宽度适应容器 */
  margin-left: auto;
  margin-right: auto;
  display: block;
}

.t-forgot .uni-easyinput__content-input {
  padding: 0 20rpx;
  height: 90rpx;
  line-height: 90rpx;
  margin-bottom: 20rpx;
  border: 1px solid #e9e9e9;
  font-size: 28rpx;
  border-radius: 50rpx;
}

.t-forgot .t-b {
  text-align: center;
  font-size: 46rpx;
  padding-bottom: 40rpx;
  font-weight: bold;
}

.link-box {
  padding: 60rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

.link-box-item {
  color: rgb(41, 121, 255);
}
</style>