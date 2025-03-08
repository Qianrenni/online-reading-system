<template>
  <view class="content"
  :style="{'backgroundColor':theme.currentTheme.backgroundColors[0],'color':theme.currentTheme.foregroundColors[0]}"
  >
    <!-- 使用 uni-nav-bar 组件 -->
    <uni-nav-bar 
      title="注册" 
      left-icon="back" 
      @clickLeft="gopage" 
      :fixed="true"
	  statusBar
		:backgroundColor="theme.currentTheme.backgroundColors[1]"
		:color="theme.currentTheme.foregroundColors[0]"
    />

    <!-- 注册表单和其他内容 -->
    <view class="container"
	:style="{'backgroundColor':theme.currentTheme.backgroundColors[1]}"
	>
      <!-- 使用 uni-forms 组件 -->
      <uni-forms ref="registerForm" :modelValue="formData" class="rounded-form">
        <!-- 用户名 -->
        <uni-forms-item label="用户名" name="username">
          <uni-easyinput v-model="formData.username" placeholder="请输入用户名"
		  :styles="{'backgroundColor':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
		  ></uni-easyinput>
        </uni-forms-item>

        <!-- 邮箱账号 -->
        <uni-forms-item label="邮箱账号" name="email">
          <uni-easyinput v-model="formData.email" type="text" placeholder="请输入邮箱地址"
		  :styles="{'backgroundColor':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
		  ></uni-easyinput>
        </uni-forms-item>

        <!-- 密码 -->
        <uni-forms-item label="密码" name="password">
          <uni-easyinput v-model="formData.password" type="password" placeholder="请输入密码"
		  :styles="{'backgroundColor':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
		  ></uni-easyinput>
        </uni-forms-item>

        <!-- 确认密码 -->
        <uni-forms-item label="确认密码" name="confirmPassword">
          <uni-easyinput v-model="formData.confirmPassword" type="password" placeholder="请再次输入密码"
		  :styles="{'backgroundColor':theme.currentTheme.backgroundColors[1],'color':theme.currentTheme.foregroundColors[0]}"
		  ></uni-easyinput>
        </uni-forms-item>

        <!-- 提交按钮 -->
        <button type="primary" @click="submitForm">注册</button>
        <text @click="goToLogin">已有账号？去登录</text>
      </uni-forms>
    </view>
  </view>
</template>

<script>
import trim from '../../uview-ui/libs/function/trim';
import { theme } from '../../configJs/theme';
export default {
  data() {
    return {
		theme:theme,
      formData: {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
    };
  },
  methods: {
    submitForm() {
      if (!this.formData.username.trim()) {
        uni.showToast({
          title: "用户名不能为空",
          icon: 'error'
        });
        return;
      }
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(this.formData.email)) {
        uni.showToast({
          title: "账号格式不对",
          icon: 'error'
        });
        return;
      }
      if (trim(this.formData.password) === '') {
        uni.showToast({
          title: "密码不能为空",
          icon: 'error'
        });
        return;
      }
      if (this.formData.password !== this.formData.confirmPassword) {
        uni.showToast({
          title: "两次密码不一致",
          icon: 'error'
        });
        return;
      }
      console.log('注册信息:', this.formData);
      // 这里添加你的提交逻辑
	  uni.request({
	    url: this.$store.state.BaseUrl + "/auth/register",
	    method: 'POST',
	    data: {
	      email: this.formData.email,
	      password: this.formData.password,
		  username:this.formData.username
	    },
	    success(response) {
	      if (response.statusCode==201) {
	        uni.showToast({
	          title: '注册成功！',
	          icon: 'none'
	        });
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
	    }
	  });
    },
    goToLogin() {
      // 跳转到登录页面
      uni.navigateTo({
        url: '/pages/login/index'
      });
    },
    gopage() {
      // 确保这里调用的是正确的跳转方法
      uni.switchTab({
        url: "/pages/user/user"
      });
    }
  }
};
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column; /* 确保子元素垂直排列 */
  align-items: center; /* 水平居中对齐 */
  justify-content:flex-start;
  min-height: 100vh; /* 使用最小高度为视口高度 */

}

.container {
  
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 16rpx;
  width: 100%;
  max-width: 360px;
  margin: auto 0;
  text-align: center; /* 使文本内容居中 */
}

.rounded-form {
  border-radius: 8px; /* 为 form 添加圆角 */
  overflow: hidden; /* 确保内部元素不会溢出圆角边界 */
}

button {
  width: 80%; /* 让按钮宽度适应容器 */
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
  display: block;
}

text {
  display: block;
  margin-top: 10px;
}

</style>