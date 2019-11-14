// - 最大安全整数处理
// - token请求头携带
// - 响应数据  获取有效数据 处理
// - token失效  TODO 待实现
// - 导出一个函数 调用接口

// 提供一个配置好的axios请求的函数（调用接口）
// 导入axios | json-bigint | store
import axios from "axios";
import JSONBIG from "json-bigint";
import store from "@/store";

// 创建axios实例instance
const instance = axios.create({
  // 定义axios的基准地址
  baseURL: "http://ttapi.research.itcast.cn/",
  // 使用jsonbig插件处理接收到的数据
  transformRequest: data => {
    try {
      // 接收的数据为true ==> 返回jsonbig形式对象
      return JSONBIG.parse(data);
    } catch (e) {
      // 数据为false ==> 返回原数据
      return data;
    }
  }
});
// 至此axios实例(主要用于修改发请求时的数据)创建完毕

// 设置请求拦截器与响应拦截器
// 拦截器是promise对象，有两个参数，resolve与reject
// 请求拦截器:追加token到请求头
// intercept  英/ˌɪntəˈsept/ vt. 拦截；截断；窃听 n. 拦截；[数] 截距；截获的情报
instance.interceptors.request(
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
instance.interceptors.response(
  res => {
    try {
      // 响应体有值时,剥离无效数据 ===> 返回res.data.data
      return res.data.data;
    } catch (e) {
      // 响应体为空 ===> 返回响应体
      return res;
    }
  },
  err => {
    Promise.reject(err);
  }
);

// 导出instance实例
export default (url, method, data) => {
  instance({
    url, // api接口地址
    method, // method请求方式(get,put,post...)
    // [] 被称为js表达式，js表达式计算出的结果必须是字符串(string)
    // get传参是params传参，其他方式传参是data传参
    // 若接口传值是大写，为了不报错，将响应方法转成小写 ===> GET get Get均视为get
    [method.toLocaleLowerCase() === "get" ? "params" : "data"]: data
  });
};
