import { protectedRoutes } from "../configJs/protectedRoutes";
import store from "../store";
export function checkAuth(to) {
  // 规范化路径格式，移除开头的斜杠以保证一致性
  const currentPagePath = (to.path || to.route || '')
	console.log("路由拦截",currentPagePath)
  // 检查当前页面是否在受保护的页面列表中
  if (protectedRoutes.includes(currentPagePath)) {
    // 检查用户是否登录
	console.log("是否登录",currentPagePath)
    const isLogin = store.state.access_token;
	// console.log(isLogin);
    if (!isLogin) {
		console.log("强制登陆");
      return false;
    }
  }
  // 对于不在黑名单中的页面，直接放行
  return true;
}