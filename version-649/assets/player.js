document.addEventListener('DOMContentLoaded', function () {
    var players = Array.prototype.slice.call(document.querySelectorAll('.js-player'));

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var startButton = player.querySelector('[data-player-start]');
        var message = player.querySelector('[data-player-message]');
        var source = player.dataset.videoSrc;
        var hlsInstance = null;
        var initialized = false;

        function setMessage(text) {
            if (message) {
                message.textContent = text;
            }
        }

        function initializeVideo() {
            if (!video || !source || initialized) {
                return;
            }

            initialized = true;
            setMessage('正在加载播放源...');

            if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: false
                });

                hlsInstance.loadSource(source);
                hlsInstance.attachMedia(video);

                hlsInstance.on(window.Hls.Events.MANIFEST_PARSED, function () {
                    setMessage('播放源已加载');
                    video.play().catch(function () {
                        setMessage('点击视频控件开始播放');
                    });
                });

                hlsInstance.on(window.Hls.Events.ERROR, function (event, data) {
                    if (data && data.fatal) {
                        setMessage('播放源加载失败，请稍后重试');
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = source;
                video.addEventListener('loadedmetadata', function () {
                    setMessage('播放源已加载');
                    video.play().catch(function () {
                        setMessage('点击视频控件开始播放');
                    });
                });
            } else {
                setMessage('当前浏览器需要 HLS 支持才能播放');
            }
        }

        if (startButton) {
            startButton.addEventListener('click', function () {
                startButton.classList.add('is-hidden');
                initializeVideo();
            });
        }

        if (video) {
            video.addEventListener('play', function () {
                if (startButton) {
                    startButton.classList.add('is-hidden');
                }
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
});
