import { createRouter, createWebHistory } from "vue-router";
import HomeView from "./views/HomeView.vue";
import PlayView from "./views/PlayView.vue";
import EndGame from "./views/EndgameView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE + URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/play",
      name: "play",
      component: PlayView,
    },
    {
      path: "/end",
      name: "end",
      component: EndGame,
    },
  ],
});

export default router;
