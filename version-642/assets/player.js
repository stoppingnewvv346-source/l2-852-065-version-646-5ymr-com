(function () {
  window.initMoviePlayer = function (source) {
    var video = document.querySelector('.player-video');
    var overlay = document.querySelector('.player-overlay');
    if (!video || !overlay || !source) {
      return;
    }

    var ready = false;
    var hlsInstance = null;

    function attachSource() {
      if (ready) {
        return;
      }
      ready = true;
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      } else if (window.Hls && window.Hls.isSupported()) {
        hlsInstance = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    }

    function playVideo() {
      attachSource();
      overlay.classList.add('is-hidden');
      video.setAttribute('controls', 'controls');
      var playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    }

    overlay.addEventListener('click', playVideo);
    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });
    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
