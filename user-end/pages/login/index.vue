<template>
  <view :style="{'background':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}" class="content">
    <!-- 使用 uni-nav-bar 组件 -->
    <uni-nav-bar 
      title="登录" 
      left-icon="back" 
      @clickLeft="goback" 
      :fixed="true"
	  statusBar
		:backgroundColor="theme.currentTheme.backgroundColors[1]"
		:color="theme.currentTheme.foregroundColors[0]"
    />

    <!-- 登录表单和其他内容 -->
    <view class="t-login" :style="{'background':theme.currentTheme.backgroundColors[1]}">
      <!-- 标题 -->
      <view class="t-b">{{ title }}</view>

      <!-- 使用 uni-forms 组件 -->
      <uni-forms ref="loginForm" :modelValue="formData">
        <!-- 账号 -->
        <uni-forms-item label="" name="email">
          <uni-easyinput v-model="formData.email" placeholder="请输入账号" maxlength="20" 
		   :styles="{'backgroundColor':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
		   />
        </uni-forms-item>

        <!-- 密码 -->
        <uni-forms-item label="" name="password">
          <uni-easyinput v-model="formData.password" type="password" placeholder="请输入密码" maxlength="20" 
		  :styles="{'backgroundColor':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
		  />
        </uni-forms-item>

        <!-- 登录按钮 -->
        <button type="primary" @click="login" :disabled="isCanlogin">登 录</button>
      </uni-forms>

      <!-- 链接 -->
      <view class="link-box">
        <view class="link-box-item" @tap="gopage('/pages/ForgotPassword/ForgotPassword')">
          忘记密码
        </view>
        <view class="link-box-item" @tap="gopage('/pages/register/register')">
          注册账号
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import trim from '../../uview-ui/libs/function/trim';
import store from '../../store';
import { theme } from '../../configJs/theme';
export default {
  data() {
    return {
		theme:theme,
      title: '欢迎回来！',
      formData: {
        email: '',
        password: ''
      },
	  isCanlogin:false
    };
  },
  onLoad() {},
  methods: {
    goback() {
      uni.switchTab({
      	url: "/pages/user/user",
      });
    },
    login() {
      if (!this.formData.email) {
        uni.showToast({
          title: '请输入账号',
          icon: 'none'
        });
        return;
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.formData.email)) {
        uni.showToast({
          title: '请输入正确的账号格式',
          icon: 'none'
        });
        return;
      }
      if (!this.formData.password) {
        uni.showToast({
          title: '请输入密码',
          icon: 'none'
        });
        return;
      }
	  this.isCanlogin=true;
	  let account=this.formData.email;
	  let password=this.formData.password;
	  let that=this;
      uni.request({
        url: this.$store.state.BaseUrl + "/auth/login",
        method: 'POST',
        data: {
          email: this.formData.email,
          password: this.formData.password
        },
        success(response) {
          if (response.data.access_token) {
            uni.showToast({
              title: '登录成功！',
              icon: 'none'
            });
			// 更新用户名
			store.commit('updateUserId',response.data.userId);
			store.commit('updateAccessToken',response.data.access_token)
			store.commit('updateUsername', response.data.username);
			store.commit('updatePassword', password);
			// 更新用户账号
			store.commit('updateUseraccount', account);
			
			// 更新用户余额
			store.commit('updateUserbalance', response.data.balance);
			store.dispatch('fetchOnShelfBooks',response.data.userId);
			store.dispatch('fetchReadingHistory',response.data.userId);
			uni.navigateBack();
          } else {
            uni.showToast({
              title: '登录失败，请检查账号或密码',
              icon: 'none'
            });
          }
        },
        fail() {
          uni.showToast({
            title: '网络请求失败，请稍后再试',
            icon: 'none'
          });
        },
		complete() {
			that.isCanlogin=false;
		}
      });
    },
    gopage(url) {
      uni.navigateTo({
        url: url
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

.t-login {
  width: 600rpx;
  margin: auto 0;
  font-size: 28rpx;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center; /* 使文本内容居中 */
}

.t-login button {
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

.t-login .uni-easyinput__content-input {
  padding: 0 20rpx;
  height: 90rpx;
  line-height: 90rpx;
  margin-bottom: 20rpx;
  border: 1px solid #e9e9e9;
  font-size: 28rpx;
  border-radius: 50rpx;
}

.t-login .t-b {
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