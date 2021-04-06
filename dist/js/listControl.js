(function (root) {
  function listControl(data, wrap) {
    var list = document.createElement('div'),
      dl = document.createElement('dl'),
      dt = document.createElement('dt'),
      close = document.createElement('div'),
      musicList = [];

    list.className = 'list';
    dt.innerHTML = '播放列表';
    close.className = 'close';
    close.innerHTML = '关闭';

    dl.appendChild(dt);
    data.forEach(function (item, index) {
      var dd = document.createElement('dd');
      dd.innerHTML = item.name

      dd.addEventListener('touchend', function () {
        selectChange(index)
      })

      dl.appendChild(dd);
      musicList.push(dd)
    })

    list.appendChild(dl);
    list.appendChild(close);
    wrap.appendChild(list);

    // 默认把第一首歌选中
    selectChange(0)

    //把列表隐藏
    var disY = list.offsetHeight;
    list.style.transform = 'translateY(' + disY + 'px)'

    close.addEventListener('touchend', slideDown)



    // 列表显示
    function slideUp() {
      list.style.transition = '0.2s';
      list.style.transform = 'translateY(0)'
    }

    // 列表隐藏
    function slideDown() {
      list.style.transition = '0.2s';
      list.style.transform = 'translateY(' + disY + 'px)'
    }

    // 激活列表播放的歌
    function selectChange(index) {
      for (var i = 0; i < musicList.length; i++) {
        musicList[i].className = ' '
      }
      musicList[index].className = 'active'
    }

    return {
      dom: list,
      musicList: musicList,
      slideUp: slideUp,
      slideDown: slideDown,
      selectChange: selectChange
    }
  }

  root.listControl = listControl;
})(window.player || (window.player = {}))