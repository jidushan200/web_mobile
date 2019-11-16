import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 导入vant移动端组件库
import Vant from "vant";
import "vant/lib/index.less";
Vue.use(Vant);
// 导入全局样式index.less
import "./styles/index.less";

// 导入 amfe-flexible
import "amfe-flexible";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
