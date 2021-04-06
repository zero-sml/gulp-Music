// 渲染图片，音乐信息，是否喜欢
// 把自执行函数暴露出去：实参，容错处理，如果第一个实参传给root为空，就可以构建一个对象给root
// 开头 ; 目的是为了防止压缩后前一个文件没有；结束，与这个自执行函数放在一起，然后报错

; (function (root) {

  // 渲染图片
  function renderPic(src) {
    root.blurImg(src);

    var img = document.querySelector(".image img")
    img.src = src
  }

  // 渲染音乐信息
  function renderInfo(data) {
    var songInfoChildren = document.querySelector('.songInfo').children;
    songInfoChildren[0].innerText = data.name;
    songInfoChildren[1].innerText = data.singer;
    songInfoChildren[2].innerText = data.album;
  }

  // 渲染是否喜欢
  function renderIsLike(isLike) {
    var lis = document.querySelectorAll('.control li');
    lis[0].className = isLike ? 'liking' : ''
  }

  // data为请求mock的数据
  root.render = function (data) {
    renderPic(data.image);
    renderInfo(data);
    renderIsLike(data.isLike);
  }
})(window.player || (window.player = {}))