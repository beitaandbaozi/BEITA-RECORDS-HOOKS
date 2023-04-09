import { createRouter, createWebHistory } from "vue-router";

const BeitaLayout = () => import("@/views/BeitaLayout.vue");
const ShareScreen = () => import("@/views/ShareScreen/ShareScreen.vue");
const AudioRecord = () => import("@/views/AudioRecord/AudioRecord.vue");
const AudioRecordDiff = () =>
  import("@/views/AudioRecordDiff/AudioRecordDiff.vue");
const VirtualListLoad = () =>
  import("@/views/VirtualListLoad/virtual-list-load.vue");
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
        {
          path: "/audio-record",
          name: "audio-record",
          component: AudioRecord,
        },
        {
          path: "/audio-record-diff",
          name: "audio-record-diff",
          component: AudioRecordDiff,
        },
        {
          path: "/virtual-list-load",
          name: "virtual-list-load",
          component: VirtualListLoad,
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
