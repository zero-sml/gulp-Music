(function ($, player) {
  function MusicPlay(dom) {
    this.wrap = dom;//播放器的容器，用于加载listControl模块
    this.dataList = []; //把数据放进来
    this.indexObj = null;//获取索引，用于切歌
    this.rotateTimer = null; //定时器的时间
    this.curIndex = null;  //设置当前的索引值为空
    this.list = null  //列表切歌对象，在列表切歌赋值
    this.progress = player.progress.pro()  //获取进度条的实例

  }
  MusicPlay.prototype = {
    init() {
      this.getDom();
      this.getData('../mock/data.json')
    },

    // 获取页面元素
    getDom() {
      this.record = document.querySelector('.image')//旋转图片
      this.controlBtn = document.querySelectorAll(".control li")//底部导航栏的按钮
    },


    // 获取数据
    getData(url) {
      var This = this
      $.ajax({
        url: url,
        method: 'get',
        success: function (data) {
          This.dataList = data; //存储请求过来的数据
          This.listPlay();    //列表切歌
          This.indexObj = new player.indexControl(data.length)//获取音乐的index
          This.loadMusic(This.indexObj.index) //加载音乐
          This.musicControl() //控制音乐操作功能
          This.dragProgress() //进度条的拖拽
          This.isLike()
        },
        error: function () {
          console.log('获取数据失败');
        }
      })
    },

    //加载音乐
    loadMusic(index) {
      var This = this
      player.render(this.dataList[index])//渲染图片，音乐的信息
      player.music.load(this.dataList[index].audioSrc)//加载音频的路径
      this.progress.renderTime(this.dataList[index].duration) //渲染音乐的总时间

      if (player.music.status == 'play') {
        player.music.play();
        this.controlBtn[2].className = 'playing';
        this.imgRotate(0);
        this.progress.move(0)   //切歌的时候需要让进度条走
      }

      this.curIndex = index
      this.list.selectChange(index)

      player.music.end(function () {
        This.loadMusic(This.indexObj.next());
      })
    },

    //控制音乐   切换音乐
    musicControl() {
      var This = this;

      // 上一首
      this.controlBtn[1].addEventListener('touchend', function () {
        player.music.status = 'play';
        This.loadMusic(This.indexObj.prev())
      })

      //控制播放/暂停
      this.controlBtn[2].addEventListener('touchend', function () {
        //当音乐播放时，点击后，按钮变为停止，音乐暂停，图片停止旋转，图标转变；
        //当音乐暂停时，点击后，按钮变为播放，音乐继续播放，图片按照之前的角度继续旋转
        if (player.music.status == 'play') {
          player.music.pause();
          this.className = " ";
          This.imgStop();
          This.progress.stop()  //停止移动进度条
        } else {
          player.music.play();
          this.className = 'playing';
          var deg = This.record.dataset.rotate || 0;
          This.imgRotate(deg)
          This.progress.move()  //进度条开始移动
        }
      })

      //下一首
      this.controlBtn[3].addEventListener('touchend', function () {
        player.music.status = 'play';
        This.loadMusic(This.indexObj.next())
      })
    },

    //播放音乐时旋转图片
    imgRotate(deg) {
      var This = this;
      clearInterval(this.rotateTimer);
      this.rotateTimer = setInterval(function () {
        deg = +deg + 0.2;
        This.record.style.transform = 'rotate(' + deg + 'deg)'
        This.record.dataset.rotate = deg  //为了保存图片旋转时候保持的角度
      }, 1000 / 60)
    },
    imgStop() {
      clearInterval(this.rotateTimer)
    },


    //播放列表的控制
    listPlay() {
      var This = this
      this.list = player.listControl(this.dataList, this.wrap)  //把listControl赋值给list

      this.controlBtn[4].addEventListener('touchend', function () {
        This.list.slideUp()
      })

      this.list.musicList.forEach(function (item, index) {
        item.addEventListener('touchend', function () {
          if (This.curIndex == index) {
            return;
          }

          player.music.status = 'play'  //让音乐播放
          This.indexObj.index = index;   //索引值对象的索引要更新到当前的suoyin
          This.loadMusic(index)          //加载当前索引的音乐
          This.list.slideDown()          //让列表消失
        })
      })
    },

    // 进度条
    dragProgress() {
      var This = this;
      var circle = player.progress.drag(document.querySelector('.circle'))
      circle.init()

      // 摁下按钮
      circle.start = function () {
        This.progress.stop()
      }

      circle.move = function (per) {
        This.progress.update(per)
      }

      circle.end = function (per) {
        var cutTime = per * This.dataList[This.indexObj.index].duration;

        player.music.playTo(cutTime)
        player.music.play();

        This.progress.move(per);
        var deg = This.record.dataset.rotate || 0;
        This.imgRotate(deg)

        This.controlBtn[2].className = 'playing';
      }

    },
    isLike() {
      this.controlBtn[0].addEventListener('touchend', function () {
        this.getAttribute('class') == 'liking' ? this.setAttribute('class', '') : this.setAttribute('class', 'liking')
      })
    }

  }
  var musicPlay = new MusicPlay(document.getElementById("wrap"))
  musicPlay.init()
})(window.Zepto, window.player);