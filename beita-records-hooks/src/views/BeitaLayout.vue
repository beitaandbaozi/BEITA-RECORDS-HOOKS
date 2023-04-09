<template>
  <div class="beita-layout">
    <!-- 共享屏幕，获得Stream流媒体，录屏为mp4文件 -->
    <div class="group">
      <div class="btn" @click="handleShareScreen">共享屏幕</div>
      <div class="btn" @click="handleVideoRecord">语音录制</div>
      <div class="btn" @click="handleVideoRecordSecond">语音录制2</div>
      <div class="btn" @click="handleVirtualListLoad">虚拟列表加载</div>
    </div>
    <div class="options">
      <RouterView />
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import { useRouter } from "vue-router";
const router = useRouter();
const goToUrl = (url: string) => {
  router.push(url);
};
// 共享屏幕
const handleShareScreen = () => {
  goToUrl("/share-screen");
};
// 语音录制
const handleVideoRecord = () => {
  goToUrl("/audio-record");
};
// 语音录制2
const handleVideoRecordSecond = () => {
  goToUrl("/audio-record-diff");
};
// 虚拟列表加载
const handleVirtualListLoad = () => {
  goToUrl("/virtual-list-load");
};
</script>

<style scoped>
.beita-layout {
  width: 100%;
  min-height: 100vh;
  background-color: lightgoldenrodyellow;
}

.group {
  display: flex;
  padding: 20px 0 0 20px;
}
.btn {
  padding: 20px;
  margin-right: 20px;

  width: auto;
  color: #fff;
  line-height: 10px;
  text-align: center;
  background-color: lightblue;
  border-radius: 5px;
  cursor: pointer;
}

.options {
  margin: 20px;
}
</style>
