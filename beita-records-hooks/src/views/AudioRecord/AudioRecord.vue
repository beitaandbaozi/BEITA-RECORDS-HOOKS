<template>
  <div class="video-record">
    <audio controls autoplay></audio>
    <div class="options">
      <div class="btn" @click="handleStartRecord">开始录制</div>
      <div class="btn" @click="handleStopRecord">停止录制</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 开始录音
const handleStartRecord = () => {
  // 获取麦克风的音频流
  navigator.mediaDevices
    .getUserMedia({ video: false, audio: true })
    .then((mediaStreamData) => {
      // 传入音频流
      playAudionFn(mediaStreamData);
    })
    .catch((err) => {
      console.log("err", err);
    });
};
let recorder: ScriptProcessorNode | null = null;
// 用于保存AudioContext对象
let audioContext: AudioContext | null = null;
let buffer: Float32Array[] = [];
// 处理音频流
const playAudionFn = (stream: MediaStream) => {
  audioContext = new AudioContext();
  // 创建音频处理的源节点，处理麦克风
  let source = audioContext.createMediaStreamSource(stream);
  // 创建声音的缓存节点
  // 参数： 缓冲区大小:0，自适应；输入声道，默认2；输出声道，默认2
  recorder = audioContext.createScriptProcessor(0, 1, 1);
  // 创建音频处理的输出节点
  let dest = audioContext.createMediaStreamDestination();
  // 串联连接
  source.connect(recorder);
  // 这里 connect destination 之后，扬声器就会播放
  // source.connect(audioContext.destination)
  recorder.connect(dest);

  // 每次音频缓冲区已满，需要您进行处理时，该节点都会发出一个 onaudioprocess，此时可以将数据保存到自己的缓冲区内
  recorder.onaudioprocess = (e) => {
    // e.inputBuffer 是 AudioBuffer 类型
    // getChannelData() 方法返回 Float32Array
    // 其中包含与通道关联的 PCM 数据，通道参数定义（0表示第一个通道）
    // console.log("e.inputBuffer", e.inputBuffer);

    // Float32Array，即数组里的每个数字都是32位的单精度浮点数
    // 表示 声音的强弱
    console.log(e.inputBuffer.getChannelData(0));

    let demoData = e.inputBuffer.getChannelData(0);
    buffer.push(new Float32Array(demoData));
  };
};
// 停止录制
const handleStopRecord = () => {
  recorder?.disconnect();
  // 释放 AudioContext 控制的资源(比如扬声器) 可以理解为停止
  audioContext?.close();
  // 合并缓冲区内接收到的 buffer 数据
  let newBuffer = mergeArray(buffer);
  // 创建 wav 文件
  createWavFile(newBuffer);
};

// 合并音频缓冲区数据  ===> 来源网络
const mergeArray = (bufferArr: Float32Array[]) => {
  let length = bufferArr.length * bufferArr[0].length;
  let data = new Float32Array(length);
  let offset = 0;
  for (let i = 0; i < bufferArr.length; i++) {
    data.set(bufferArr[i], offset);
    offset += bufferArr[i].length;
  }
  return data;
};

// 创建wav文件， 并播放
const createWavFile = (audioData: Float32Array) => {
  const WAV_HEAD_SIZE = 44;
  let bufferTem = new ArrayBuffer(audioData.length * 2 + WAV_HEAD_SIZE);
  // 需要用一个view来操控buffer
  let view = new DataView(bufferTem);
  // 写入wav头部信息
  // RIFF chunk descriptor/identifier
  // 资源交换文件标识符
  writeUTFBytes(view, 0, "RIFF");
  // RIFF chunk length，
  view.setUint32(4, 44 + audioData.length * 2, true);
  // RIFF type，WAV文件标志
  writeUTFBytes(view, 8, "WAVE");
  // format chunk identifier，波形格式标志
  // FMT sub-chunk
  writeUTFBytes(view, 12, "fmt ");
  // format chunk length
  view.setUint32(16, 16, true);
  // sample format (raw)
  view.setUint16(20, 1, true);
  // stereo (2 channels)
  view.setUint16(22, 2, true);
  // sample rate，播放速度
  view.setUint32(24, 24500, true);
  // byte rate (sample rate * block align)
  view.setUint32(28, 44100 * 2, true);
  // block align (channel count * bytes per sample)
  view.setUint16(32, 2 * 2, true);
  // bits per sample
  view.setUint16(34, 16, true);
  // data sub-chunk
  // data chunk identifier，数据标识符
  writeUTFBytes(view, 36, "data");
  // data chunk length，采样数据总数,即数据总大小
  view.setUint32(40, audioData.length * 2, true);

  // 写入PCM数据
  let length = audioData.length;
  let index = 44;
  let volume = 1;
  for (let i = 0; i < length; i++) {
    view.setInt16(index, audioData[i] * (0x7fff * volume), true);
    index += 2;
  }

  // 转成Blob
  console.log(view);
  let blob = new Blob([view], { type: "audio/wav" });
  console.log(blob);

  // 生成一个本地的blob url
  let blobUrl = URL.createObjectURL(blob);
  // console.log(blobUrl);

  // 给audio标签的src属性
  document.querySelector("audio").src = blobUrl;
  // console.log(document.querySelector('audio'))

  // 下载wav文件
  // let aDom = document.createElement("a");
  // aDom.setAttribute("href", blobUrl);
  // aDom.setAttribute("download", "");
  // aDom.click();
  // URL.revokeObjectURL(blobUrl);
};

const writeUTFBytes = (view: DataView, offset: number, string: string) => {
  var lng = string.length;
  for (var i = 0; i < lng; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};
</script>

<style scoped>
.video-record {
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
</style>
