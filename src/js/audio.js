(function (root) {
  function AudioMange() {
    this.audio = new Audio();
    this.status = 'pause';
  }

  AudioMange.prototype = {
    //加载音乐
    load(src) {
      this.audio.src = src;
      this.audio.load()
    },

    // 播放音乐
    play() {
      this.audio.play();
      this.status = 'play'
    },

    // 暂停音乐
    pause() {
      this.audio.pause();
      this.status = 'pause'
    },

    // 音乐播放完成事件
    end(fn) {
      this.audio.onended = fn
    },

    // 跳到音乐的某个时间点
    playTo(time) {
      this.audio.currentTime = time;//单位是秒
    }

  }

  root.music = new AudioMange()
})(window.player || (window.player = {}))