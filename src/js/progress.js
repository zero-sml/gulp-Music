(function (root) {
  //进度条
  function Progress() {
    this.durTime = 0; //获取歌曲总时间
    this.frameId = null;//定时器
    this.startTime = 0; //记录当前时间
    this.lastTime = 0; //进度条播放暂停的距离
    this.init()
  }
  Progress.prototype = {
    init() {
      this.getDom()
      this.renderTime()
    },

    getDom() {
      this.curTime = document.querySelector('.leftTime');
      this.circle = document.querySelector('.circle');
      this.frontBg = document.querySelector('.frontBg');
      this.totalTime = document.querySelector('.rightTime')
    },

    renderTime(time) {
      this.durTime = time;//把总时间重新赋值；单位是秒
      time = this.formatTime(time);
      this.totalTime.innerHTML = time
    },

    formatTime(time) {
      time = Math.round(time)
      var m = Math.floor(time / 60);
      var s = time % 60;
      m = m < 10 ? '0' + m : m;
      s = s < 10 ? '0' + s : s;
      return m + ':' + s
    },

    //进度条移动
    move(val) {
      cancelAnimationFrame(this.frameId)
      var This = this
      this.startTime = new Date().getTime()
      this.lastTime = val === undefined ? this.lastTime : val;

      function frame() {
        var curTime = new Date().getTime()
        var per = This.lastTime + (curTime - This.startTime) / (This.durTime * 1000)  //转化成为百分比

        if (per <= 1) {
          This.update(per)
        } else {
          //关闭定时器
          cancelAnimationFrame(This.frameId)
        }

        //开启定时器，时间是按照浏览器刷新的频率逐帧变化的
        This.frameId = requestAnimationFrame(frame)
      }
      frame()
    },

    //更新进度条，走的时间，百分比
    update(per) {
      //更新走的时间
      var time = this.formatTime(per * this.durTime);
      this.curTime.innerHTML = time

      //更新前背景的进度体
      this.frontBg.style.width = per * 100 + '%'

      //更新小圆点的位置
      var c = per * this.circle.parentNode.offsetWidth;
      this.circle.style.transform = 'translateX(' + c + 'px)'
    },

    stop() {
      cancelAnimationFrame(this.frameId);//关闭定时器
      var stopTime = new Date().getTime()//获取停止时间
      this.lastTime += (stopTime - this.startTime) / (this.durTime * 1000)
    }
  }



  function instanceProgress() {
    return new Progress()
  }


  // 拖拽
  function Drag(obj) {
    this.obj = obj;//拖拽的元素
    this.startPoint = 0; //拖拽时摁下坐标的位置
    this.startLeft = 0;  //拖拽移动的距离
    this.percent = 0;   //拖拽百分比

  }
  Drag.prototype = {
    init() {
      var This = this;
      this.obj.style.transform = 'translateX(0)'

      // 拖拽开始
      this.obj.addEventListener('touchstart', function (ev) {
        This.startPoint = ev.changedTouches[0].pageX; //记录第一根手指摁下
        This.startLeft = parseFloat(this.style.transform.split('(')[1]) //摁下时离左边的距离
        This.start && This.start() //对外暴露拖拽的方法
      }),

        // 拖拽开始移动
        this.obj.addEventListener('touchmove', function (ev) {
          This.disPoint = ev.changedTouches[0].pageX - This.startPoint
          var l = This.startLeft + This.disPoint;
          if (l < 0) {
            l = 0
          } else if (l > this.offsetParent.offsetWidth) {
            l = this.offsetParent.offsetWidth
          }
          this.style.transform = 'translateX(' + l + 'px)'

          This.percent = l / this.offsetParent.offsetWidth
          This.move && This.move(This.percent)

          ev.preventDefault()
        }),

        // 拖拽结束
        this.obj.addEventListener('touchend', function () {
          This.end && This.end(This.percent)
        })
    }

  }
  function instanceDrag(obj) {
    return new Drag(obj)
  }

  root.progress = {
    pro: instanceProgress,
    drag: instanceDrag
  }
})(window.player || (window.player = {}))