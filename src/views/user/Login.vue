<template>
  <div class="page-login">
    <van-nav-bar left-arrow title="登录"></van-nav-bar>
    <van-cell-group>
      <van-field
        v-model="loginForm.mobile"
        required
        clearable
        label="手机号"
        placeholder="请输入手机号"
        @blur="checkMobile"
        :error-message="errMsg.mobile"
      />
      <van-field
        v-model="loginForm.code"
        type="code"
        label="验证码"
        placeholder="请输入验证码"
        required
        @blur="checkCode"
        :error-message="errMsg.code"
      >
        <van-button class="p5" slot="button" size="mini" type="primary"
          >发送验证码</van-button
        >
      </van-field>
      <div class="btn_box">
        <van-button type="info" @click="login" block round>登 录</van-button>
      </div>
    </van-cell-group>
  </div>
</template>

<script>
import { login } from "@/api/user";
import { mapMutations } from "vuex";

export default {
  name: "user-chat",
  data() {
    return {
      // 表单数据
      loginForm: {
        mobile: "13911111111",
        code: "246810"
      },
      // 错误时的提示信息
      errMsg: {
        mobile: "",
        code: ""
      }
    };
  },
  methods: {
    checkMobile() {
      // 1. 为空
      if (!this.loginForm.mobile) {
        this.errMsg.mobile = "请输入手机号";
        return false;
      }
      // 2. 不符合格式
      if (!/^[1][3-9]\d{9}$/.test(this.loginForm.mobile)) {
        this.errMsg.mobile = "请输入正确格式的手机号";
        return false;
      }
      // 3. 成功
      this.errMsg.mobile = "";
    },
    checkCode() {
      // 1. 为空
      if (!this.loginForm.code) {
        this.errMsg.code = "请输入验证码";
      }
      // 2. 不符合格式
      if (!/^\d{6}$/.test(this.loginForm.code)) {
        this.errMsg.code = "请输入正确格式的验证码";
      }
      // 3. 成功
      this.errMsg.code = "";
    },
    async login() {
      this.checkMobile();
      this.checkCode();
      // 检查errMsg是否有值,有提示信息则校验失败
      if (this.errMsg.mobile || this.errMsg.code) {
        return false;
      }
      // 如果校验成功进行登录
      try {
        // 基于request发送登录请求
        const data = await login(this.loginForm); // data中包括token与refresh_token
        // console.log(data);
        // 登录成功
        // 1. 更新vuex的token/refresh_token与本地的
        this.setUser(data);
        // 2. 登录后跳转（如果地址栏有回跳地址哪就回跳，如果没有跳转到个人中心）
        const { returnUrl } = this.$route.query;
        this.$router.push(returnUrl || "/user"); // || && 短路或 短路与
      } catch (e) {
        // 登录请求发送失败
        this.$toast.fail("手机号或验证码错误——数据/形参有问题");
      }
    },
    ...mapMutations(["setUser"])
  }
};
</script>

<style scoped lang="less">
.p5 {
  padding: 0 5px;
}
.btn_box {
  padding: 10px;
  .van-button {
    height: 32px;
    line-height: 30px;
  }
}
</style>
