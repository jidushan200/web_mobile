// - 最大安全整数处理
// - token请求头携带
// - 响应数据  获取有效数据 处理
// - token失效  TODO 待实现
// - 导出一个函数 调用接口

// 提供一个配置好的axios请求的函数（调用接口）
// 导入axios | json-bigint | store | router
import axios from "axios";
import JSONBIG from "json-bigint";
import store from "@/store";
import router from "@/router";

// 创建axios实例instance
const instance = axios.create({
  // 定义axios的基准地址
  baseURL: "http://ttapi.research.itcast.cn/",
  // 使用jsonbig插件处理数据
  // 转换响应数据格式
  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [
    // data 是原始数据格式
    data => {
      try {
        // 接收的数据为true ==> 返回jsonbig形式对象
        const transData = JSONBIG.parse(data);
        console.log(data);
        console.log(transData);
        return transData;
        // return JSONBIG.parse(data);
      } catch (e) {
        // 数据为false ==> 返回原数据
        return data;
      }
    }
  ]
});
// 至此axios实例(主要用于修改发请求时的数据)创建完毕

// 设置请求拦截器与响应拦截器
// 拦截器是promise对象，有两个参数，resolve与reject
// 请求拦截器:追加token到请求头
// intercept  英/ˌɪntəˈsept/ vt. 拦截；截断；窃听 n. 拦截；[数] 截距；截获的情报
instance.interceptors.request.use(
  config => {
    // 请求拦截成功时
    // 获取token ==> 追加token请求头
    // 获取的token为store.state.user.token
    if (store.state.user.token) {
      config.headers.Authorization = `Bearer ${store.state.user.token}`; // state中user的token存在则追加
    }
    return config; // state.user.token为空，直接返回当前请求数据
  },
  err => {
    Promise.reject(err);
  }
);
// 响应拦截器:获取有效数据 + 延长token的有效期(TODO)
instance.interceptors.response.use(
  res => {
    try {
      // 响应体有值时,剥离无效数据 ===> 返回res.data.data
      return res.data.data;
    } catch (e) {
      // 响应体为空 ===> 返回响应体
      return res;
    }
  },
  async err => {
    // 请求失败时，进入失败响应代码段
    // 1. 响应状态码是否是401
    // 2. 是否是登录状态
    // 2.1  是登录状态 ===> 按token失效处理——通过refresh_token获取token,再更新vuex与本地token
    // 2.2  不是登录状态 ===> 跳转到登录页面(需要回跳)
    // 3. 发送刷新token请求
    // 3.1  发送请求成功 ===> 更新vuex与本地token | 重新请求文章信息, 获取文章信息渲染页面
    // 3.2  刷新失败(refresh_token失效，14天有效期已过)
    if (err.response && err.response.status === 401) {
      // 设置跳转登录界面的回跳
      // currentRoute 相当于 写的routes,但在解析过程中routes转化成了currentRoute
      const loginBack = {
        path: "/login",
        query: { returnUrl: router.currentRoute.path }
      };
      const user = store.state.user; // 获取本地token值(即用户信息)
      // 不是登录状态
      if (!user || !user.token || !user.refresh_token) {
        // 跳转到登录界面，重新登录
        return router.push(loginBack);
      }
      // 是登录状态 —— 按token失效处理
      // 当token失效的时候需要有如下处理
      // - 判断是否登录过，如果没有拦截到登录页面，且登录完成需要回跳。
      // - 如果登录过，本地存储了refresh_token，使用他向后台发请求获取新的token
      // - 如果刷新成功，更新token，把原来的请求继续发送即可
      // - 如果刷新失败，删除token，拦截到登录页面，且登录完成需要回跳。

      try {
        // 发送“刷新token”请求
        // 避免使用instance实例，因为instance的设置中，发送请求是会添加默认请求头
        const {
          data: { data }
        } = await axios({
          url: "http://ttapi.research.itcast.cn/app/v1_0/authorizations",
          method: "put",
          headers: {
            Authorization: `Bearer ${user.refresh_token}` //添加refresh_token请求头
          }
        });
        // res是响应对象,res.data.data.token来获取token
        // 更新vuex与本地token
        store.commit("setUser", {
          token: data.token,
          refresh_token: data.refresh_token
        });
        // 在更新token后，继续发送之前失败的请求
        return instance(err.config);
      } catch (e) {
        // 请求发送失败
        // 删除过期token
        store.commit("delUser");
        // 转到登录界面
        return router.push(loginBack);
      }
    }
  }
);

// 导出instance实例
export default (url, method, data) => {
  // 注意：调用接口时，需要返回值
  return instance({
    url, // api接口地址
    method, // method请求方式(get,put,post...)
    // [] 被称为js表达式，js表达式计算出的结果必须是字符串(string)
    // get传参是params传参，其他方式传参是data传参
    // 若接口传值是大写，为了不报错，将响应方法转成小写 ===> GET get Get均视为get
    [method.toLocaleLowerCase() === "get" ? "params" : "data"]: data
  });
};
