// 操作localStorage的一些函数。
// - 目的：将来实现刷新token，需要存储的信息。关闭浏览器后再次打开，需要保持登录状态。

// 权限认证  token 令牌
// 提供  获取token  设置token  删除token
const USER_KEY = "web-mobile-user";

// 读取token
export const getUser = () => JSON.parse(localStorage.getItem(USER_KEY) || "{}");

// 修改token
export const setUser = user => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// 删除token
export const delUser = () => {
  localStorage.removeItem(USER_KEY);
};
