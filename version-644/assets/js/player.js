(function () {
    function initMoviePlayer(videoId, source, overlayId) {
        var video = document.getElementById(videoId);
        var overlay = document.getElementById(overlayId);
        var ready = false;
        var hls = null;

        if (!video || !source) {
            return;
        }

        function bindSource() {
            if (ready) {
                return;
            }

            ready = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hls.loadSource(source);
                hls.attachMedia(video);
            } else {
                video.src = source;
            }
        }

        function start() {
            bindSource();

            if (overlay) {
                overlay.hidden = true;
            }

            video.controls = true;

            var attempt = video.play();

            if (attempt && typeof attempt.catch === 'function') {
                attempt.catch(function () {
                    if (overlay) {
                        overlay.hidden = false;
                    }
                });
            }
        }

        if (overlay) {
            overlay.addEventListener('click', start);
        }

        video.addEventListener('click', function () {
            if (!ready) {
                start();
            }
        });

        video.addEventListener('play', function () {
            if (overlay) {
                overlay.hidden = true;
            }
        });

        window.addEventListener('pagehide', function () {
            if (hls && typeof hls.destroy === 'function') {
                hls.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
