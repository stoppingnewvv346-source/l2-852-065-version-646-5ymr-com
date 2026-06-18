(function () {
  var video = document.querySelector('[data-player]');
  var button = document.querySelector('[data-play-button]');
  var loaded = false;
  var player = null;

  function attachStream() {
    if (!video || loaded || typeof streamUrl === 'undefined') {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      loaded = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      player = new window.Hls({
        maxBufferLength: 30,
        enableWorker: true
      });
      player.loadSource(streamUrl);
      player.attachMedia(video);
      loaded = true;
      return;
    }

    video.src = streamUrl;
    loaded = true;
  }

  function playVideo() {
    if (!video) {
      return;
    }

    attachStream();

    if (button) {
      button.classList.add('is-hidden');
    }

    var result = video.play();

    if (result && typeof result.catch === 'function') {
      result.catch(function () {
        if (button) {
          button.classList.remove('is-hidden');
        }
      });
    }
  }

  if (button) {
    button.addEventListener('click', playVideo);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      if (button) {
        button.classList.add('is-hidden');
      }
    });

    video.addEventListener('pause', function () {
      if (button && video.currentTime === 0) {
        button.classList.remove('is-hidden');
      }
    });
  }

  window.addEventListener('pagehide', function () {
    if (player && typeof player.destroy === 'function') {
      player.destroy();
    }
  });
}());
