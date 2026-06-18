(function () {
  function setupMoviePlayer(config) {
    var video = document.querySelector(config.videoSelector);
    var cover = document.querySelector(config.coverSelector);
    var status = document.querySelector(config.statusSelector);
    var source = config.source;
    var hlsInstance = null;
    var ready = false;

    function setStatus(text) {
      if (status) {
        status.textContent = text || '';
      }
    }

    function attachSource() {
      if (!video || !source || ready) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        ready = true;
        return;
      }

      if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
          ready = true;
        });
        hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            setStatus('播放暂时无法加载');
          }
        });
        return;
      }

      video.src = source;
      ready = true;
    }

    function play() {
      if (!video) {
        return;
      }
      attachSource();
      if (cover) {
        cover.classList.add('is-hidden');
      }
      video.controls = true;
      var promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(function () {
          setStatus('点击视频继续播放');
        });
      }
    }

    if (cover) {
      cover.addEventListener('click', play);
    }
    if (video) {
      video.addEventListener('click', function () {
        if (!video.src && !ready) {
          play();
        }
      });
    }
    window.addEventListener('beforeunload', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  }

  window.setupMoviePlayer = setupMoviePlayer;
})();
