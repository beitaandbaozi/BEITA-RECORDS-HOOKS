<template>
  <div class="share-screen">
    <h1>共享屏幕，Stream流，录屏</h1>
    <video id="localVideo" class="video-dom" autoplay playsinline muted></video>
    <div class="options">
      <div class="btn" @click="handleShareScreen">共享桌面</div>
      <div class="btn" @click="handleStartRecord">开始录屏</div>
      <div class="btn" @click="handleStopRecord">停止录屏</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 共享桌面
const handleShareScreen = async () => {
  // 提示用户去选择和授权捕获展示的内容或部分内容
  let localStream = await navigator.mediaDevices.getDisplayMedia({
    audio: true,
    video: true,
  });
  // 播放共享视频流
  playShareScreen(localStream);
  // 获取文件流
  getMediaStream(localStream);
};
// 播放共享视频
const playShareScreen = (stream: any) => {
  const videoDom = document.querySelector("#localVideo");
  videoDom!.srcObject = stream;
};
// 获取录制的视频流
let mediaRecorder: MediaRecorder | null = null;
const getMediaStream = (stream: any) => {
  // 属性对象
  const options = {
    // 音频、视频的码率
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000,
    mimeType: "video/webm",
  };
  // MediaRecorder 用于录制媒体流的 API，将录制的数据保存成一个文件
  mediaRecorder = new MediaRecorder(stream, options);
};

// 开始录屏
const handleStartRecord = () => {
  if (mediaRecorder) {
    mediaRecorder.start();
    mediaRecorder.onstart = () => {
      console.log("开始录屏");
    };
    // 获取当前有用的数据
    mediaRecorder.ondataavailable = (e) => {
      console.log("当前录屏数据", e.data);
      // 将录制的数据合并成一个 Blob 对象
      const blobObj = new Blob([e.data], { type: "video/mp4Z" });
      downBlob(blobObj);
    };
  } else {
    return alert("没点击共享功能！");
  }
};
// 下载文件
const downBlob = (file: Blob) => {
  // 将文件转化成一个url地址
  const blobUrl = URL.createObjectURL(file);
  const a = document.createElement("a");
  a.href = blobUrl;
  // 设置 a 标签的 download 属性为文件名
  a.download = "recordVideo.mp4";
  a.click();
  // 释放URL 地址
  URL.revokeObjectURL(blobUrl);
};

// 停止录屏
const handleStopRecord = () => {
  if (!mediaRecorder) return alert("没有点击录制！");
  console.log("停止录屏");
  mediaRecorder?.stop();
};
</script>

<style scoped>
.share-screen {
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

.video-dom {
  width: 80%;
  height: 60%;
}
</style>
