import Vue from "vue";
import VueRouter from "vue-router";

const Layout = () => import("@/views/Layout");
const Home = () => import("@/views/home/Index");
const Question = () => import("@/views/question/Index");
const Video = () => import("@/views/video/Index");
const User = () => import("@/views/user/Index");
const UserProfile = () => import("@/views/user/Profile");
const UserChat = () => import("@/views/user/Chat");
const Login = () => import("@/views/user/Login");
const Search = () => import("@/views/search/Index");
const SearchResult = () => import("@/views/search/Result");
const Article = () => import("@/views/home/Article");

Vue.use(VueRouter);

// - 根据约定的路由规则定义。
// - 且先定义规则对应的组件。
const routes = [
  // 公用布局相关的
  {
    path: "/",
    component: Layout,
    children: [
      { path: "/", name: "home", component: Home },
      { path: "/question", name: "question", component: Question },
      { path: "/video", name: "video", component: Video },
      { path: "/user", name: "user", component: User }
    ]
  },
  { path: "/user/profile", name: "user-profile", component: UserProfile },
  { path: "/user/chat", name: "user-chat", component: UserChat },
  { path: "/login", name: "login", component: Login },
  { path: "/search", name: "search", component: Search },
  { path: "/search/result", name: "search-result", component: SearchResult },
  { path: "/article", name: "article", component: Article }
];

const router = new VueRouter({
  routes
});

export default router;
