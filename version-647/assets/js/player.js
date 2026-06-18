(function () {
  var panels = document.querySelectorAll('.js-player');
  panels.forEach(function (panel) {
    var video = panel.querySelector('video');
    var button = panel.querySelector('.play-mask');
    var source = panel.getAttribute('data-video');
    var hlsInstance = null;
    var ready = false;

    var prepare = function () {
      if (ready || !video || !source) {
        return;
      }
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
      ready = true;
    };

    var start = function () {
      prepare();
      panel.classList.add('is-playing');
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {});
      }
    };

    if (button) {
      button.addEventListener('click', start);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (video.paused) {
          start();
        }
      });
      video.addEventListener('play', function () {
        panel.classList.add('is-playing');
      });
      video.addEventListener('pause', function () {
        panel.classList.remove('is-playing');
      });
      video.addEventListener('ended', function () {
        panel.classList.remove('is-playing');
      });
    }
    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
