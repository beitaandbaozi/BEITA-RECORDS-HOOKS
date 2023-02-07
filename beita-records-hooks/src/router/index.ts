import { createRouter, createWebHistory } from "vue-router";

const BeitaLayout = () => import("../views/BeitaLayout.vue");
const ShareScreen = () => import("../views/ShareScreen.vue");

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "layout",
      component: BeitaLayout,
      children: [
        {
          path: "/share-screen",
          name: "share-screen",
          component: ShareScreen,
        },
      ],
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import("../views/AboutView.vue"),
    // },
  ],
});

export default router;
