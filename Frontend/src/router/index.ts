import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/Home.vue";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Game from "@/views/Game.vue";
import History from "@/views/History.vue";
import Review from "@/views/Review.vue";
import LeaderBoard from "@/views/LeaderBoard.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/game",
    name: "Game",
    component: Game,
  },
  {
    path: "/review/:id",
    name: "Review",
    component: Review,
    props: true,
  },
  {
    path: "/history/:id",
    name: "History",
    component: History,
  },
  {
    path: "/leaderboard",
    name: "LeaderBoard",
    component: LeaderBoard,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
