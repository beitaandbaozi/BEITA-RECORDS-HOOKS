<template>
  <div class="audio-record-diff">
    <audio controls autoplay></audio>
    <div class="options">
      <div class="btn" @click="handleStartRecord">开始录制</div>
      <div class="btn" @click="handleStopRecord">停止录制</div>
    </div>
    <div class="record" v-show="isRecord">🏀</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// 是否正在录制
const isRecord = ref<boolean>(false);
// 获取音频的流
let audioRecorder: MediaRecorder | null = null;
// 存储音频流
const chunks = ref<any[]>([]);
// 开始录制
const handleStartRecord = async () => {
  // 获取音频流
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
  });
  audioRecorder = new MediaRecorder(stream);
  audioRecorder.start();
  audioRecorder.onstart = () => {
    isRecord.value = true;
    console.log("开始录制");
  };
  // 获取当前有用的数据
  audioRecorder.ondataavailable = (e) => {
    console.log("当前录屏数据", e.data);
    // 将录制的数据合并成一个 Blob 对象
    chunks.value.push(e.data);
  };
};

// 停止录制
const handleStopRecord = () => {
  if (audioRecorder) {
    audioRecorder.stop();
    audioRecorder.onstop = (e) => {
      const blob = new Blob(chunks.value, { type: "audio/ogg; codecs=opus" });
      chunks.value = [];
      const audioURL = window.URL.createObjectURL(blob);

      document.querySelector("audio").src = audioURL;

      const a = document.createElement("a");
      a.href = audioURL;
      // 设置 a 标签的 download 属性为文件名
      a.download = "录音.ogg";
      a.click();
      // 释放URL 地址
      URL.revokeObjectURL(audioURL);
      isRecord.value = false;
    };
  }
};
</script>

<style scoped>
.audio-record-diff {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.options {
  display: flex;
  margin-top: 20px;
}

.btn {
  margin-right: 10px;
  padding: 10px;
  width: auto;
  color: #fff;
  height: 40px;
  line-height: 20px;
  text-align: center;
  background-color: lightseagreen;
  border-radius: 5px;
  cursor: pointer;
}

.record {
  font-size: 30px;
  margin-top: 40px;
  animation: scaleLoading 0.5s linear 0.5s infinite;
}

@keyframes scaleLoading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
