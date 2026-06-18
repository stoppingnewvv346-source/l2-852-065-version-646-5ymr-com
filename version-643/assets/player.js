(function () {
  var baseUrl = '';
  var scripts = document.getElementsByTagName('script');
  var current = scripts[scripts.length - 1];
  if (current && current.src) {
    baseUrl = current.src.slice(0, current.src.lastIndexOf('/') + 1);
  }

  var hlsPromise = null;

  function loadHls() {
    if (window.Hls) {
      return Promise.resolve(window.Hls);
    }
    if (!hlsPromise) {
      hlsPromise = import(baseUrl + 'hls-vendor-dru42stk.js').then(function (module) {
        return module.H;
      }).catch(function () {
        return null;
      });
    }
    return hlsPromise;
  }

  function hideCover(cover) {
    if (cover) {
      cover.classList.add('is-hidden');
    }
  }

  window.SitePlayer = function (streamUrl) {
    var video = document.getElementById('movie-player');
    var cover = document.querySelector('[data-player-cover]');
    var started = false;
    var hlsInstance = null;

    if (!video || !streamUrl) {
      return;
    }

    function attachStream() {
      if (started) {
        return Promise.resolve();
      }
      started = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        return Promise.resolve();
      }

      return loadHls().then(function (Hls) {
        if (Hls && Hls.isSupported()) {
          hlsInstance = new Hls({
            enableWorker: true,
            lowLatencyMode: true
          });
          hlsInstance.loadSource(streamUrl);
          hlsInstance.attachMedia(video);
          return;
        }
        video.src = streamUrl;
      });
    }

    function play() {
      attachStream().then(function () {
        hideCover(cover);
        var playback = video.play();
        if (playback && playback.catch) {
          playback.catch(function () {
            video.setAttribute('controls', 'controls');
          });
        }
      });
    }

    if (cover) {
      cover.addEventListener('click', play);
      cover.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          play();
        }
      });
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        play();
      } else {
        video.pause();
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  };
})();
