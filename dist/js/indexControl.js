(function (root) {
  function Index(len) {
    this.index = 0;
    this.len = len
  }

  Index.prototype = {
    //切换上一首
    prev() {
      return this.get(-1)
    },

    // 切换下一首
    next() {
      return this.get(1)
    },

    // 得到当前索引
    get(val) {
      this.index = (this.index + val + this.len) % this.len;//可以处理边界问题
      return this.index;
    }
  }

  root.indexControl = Index;
})(window.player || (window.player = {}))