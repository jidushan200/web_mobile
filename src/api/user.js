// 提供用户相关的API函数
import request from "@/utils/request";

/**
 * 登录
 * @param {String} mobile - 手机号
 * @param {String} code - 验证码
 */
export const login = ({ mobile, code }) => {
  return request("/app/v1_0/authorizations", "post", { mobile, code });
};
