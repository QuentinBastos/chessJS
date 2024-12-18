import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/HomeGame.vue";
import Login from "@/views/ChessLogin.vue";
import Register from "@/views/ChessRegister.vue";
import Game from "@/views/ChessGame.vue";
import History from "@/views/ChessHistory.vue";
import Review from "@/views/ChessReview.vue";
import LeaderBoard from "@/views/ChessLeaderBoard.vue";

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
