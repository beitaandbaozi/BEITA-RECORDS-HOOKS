<template>
  <div class="beita-layout">
    <!-- 共享屏幕，获得Stream流媒体，录屏为mp4文件 -->
    <div class="group">
      <div class="btn">共享屏幕</div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.beita-layout {
  width: 100%;
  height: 100vh;
  background-color: lightgoldenrodyellow;
}

.group {
  display: flex;
  padding: 20px 0 0 20px;
}
.btn {
  width: auto;
  padding: 20px;
  color: #fff;
  line-height: 10px;
  text-align: center;
  background-color: lightblue;
  border-radius: 5px;
}
</style>
