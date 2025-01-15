import { createWebHistory, createRouter } from "vue-router";
import Home from "@/views/HomeGame.vue";
import Login from "@/views/ChessLogin.vue";
import Register from "@/views/ChessRegister.vue";
import Game from "@/views/ChessGame.vue";
import History from "@/views/ChessHistory.vue";
import Review from "@/views/ChessReview.vue";
import LeaderBoard from "@/views/ChessLeaderBoard.vue";
import {API_URL} from "@/constants";
import axios from "axios";
import Profil from "@/views/ChessAccount.vue";

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
    path: "/profil",
    name: "Profil",
    component: Profil,
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


const checkServerStatus = async () => {
  try {
    const response = await axios.get(`${API_URL}/status`);
    return response.status === 200;
  } catch (error) {
    console.error('Erreur lors de la vérification du statut du serveur :', error);
    return false;
  }
};

router.beforeEach(async (to, from, next) => {
  const currentUser = localStorage.getItem("jwt_token");
  const serverIsUp = await checkServerStatus();
  if (!serverIsUp) {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt_token");
    if (to.name !== 'Home') {
      next({ name: 'Home' });
    } else {
      next();
    }
  } else if (!currentUser && to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Home') {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt_token");
    next({ name: 'Login' });
  } else {
    next();
  }
});

export default router;
