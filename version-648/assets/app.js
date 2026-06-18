(function () {
    function ready(callback) {
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", callback);
        } else {
            callback();
        }
    }

    function setupNavigation() {
        var toggle = document.querySelector("[data-nav-toggle]");
        var menu = document.querySelector("[data-mobile-nav]");
        if (!toggle || !menu) {
            return;
        }
        toggle.addEventListener("click", function () {
            menu.classList.toggle("is-open");
        });
    }

    function setupImages() {
        var images = document.querySelectorAll(".poster-image");
        images.forEach(function (image) {
            image.addEventListener("error", function () {
                image.classList.add("is-missing");
            });
        });
    }

    function setupHero() {
        var root = document.querySelector("[data-hero]");
        if (!root) {
            return;
        }
        var slides = Array.prototype.slice.call(root.querySelectorAll("[data-hero-slide]"));
        var dots = Array.prototype.slice.call(root.querySelectorAll("[data-hero-dot]"));
        if (slides.length < 2) {
            return;
        }
        var current = 0;
        var timer = null;

        function show(index) {
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle("is-active", slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle("is-active", dotIndex === current);
            });
        }

        function start() {
            stop();
            timer = window.setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        function stop() {
            if (timer) {
                window.clearInterval(timer);
            }
        }

        dots.forEach(function (dot) {
            dot.addEventListener("click", function () {
                var index = parseInt(dot.getAttribute("data-hero-dot"), 10);
                show(index);
                start();
            });
        });
        root.addEventListener("mouseenter", stop);
        root.addEventListener("mouseleave", start);
        start();
    }

    function setupSearch() {
        var scopes = document.querySelectorAll("[data-search-scope]");
        scopes.forEach(function (scope) {
            var input = scope.querySelector("[data-search-input]");
            var filters = Array.prototype.slice.call(scope.querySelectorAll("[data-filter]"));
            var cards = Array.prototype.slice.call(scope.querySelectorAll(".movie-card"));

            function normalize(value) {
                return String(value || "").toLowerCase().trim();
            }

            function update() {
                var keyword = normalize(input ? input.value : "");
                var activeFilters = {};
                filters.forEach(function (filter) {
                    activeFilters[filter.getAttribute("data-filter")] = normalize(filter.value);
                });
                cards.forEach(function (card) {
                    var text = normalize([
                        card.getAttribute("data-title"),
                        card.getAttribute("data-tags"),
                        card.textContent
                    ].join(" "));
                    var matched = !keyword || text.indexOf(keyword) !== -1;
                    Object.keys(activeFilters).forEach(function (key) {
                        var expected = activeFilters[key];
                        if (!expected) {
                            return;
                        }
                        var actual = normalize(card.getAttribute("data-" + key));
                        if (actual !== expected) {
                            matched = false;
                        }
                    });
                    card.classList.toggle("is-hidden", !matched);
                });
            }

            if (input) {
                input.addEventListener("input", update);
            }
            filters.forEach(function (filter) {
                filter.addEventListener("change", update);
            });
            var params = new URLSearchParams(window.location.search);
            var query = params.get("q");
            if (query && input) {
                input.value = query;
                update();
            }
        });
    }

    function setupPlayers() {
        var players = document.querySelectorAll("[data-player]");
        players.forEach(function (player) {
            var video = player.querySelector("video");
            var button = player.querySelector("[data-play-button]");
            var status = player.querySelector("[data-player-status]");
            var stream = player.getAttribute("data-stream");
            var started = false;
            var hls = null;

            function setStatus(message) {
                if (status) {
                    status.textContent = message || "";
                }
            }

            function playVideo() {
                if (!video || !stream) {
                    setStatus("播放服务暂不可用");
                    return;
                }
                if (started) {
                    video.play();
                    return;
                }
                started = true;
                setStatus("正在载入播放内容");
                if (button) {
                    button.classList.add("is-hidden");
                }
                if (video.canPlayType("application/vnd.apple.mpegurl")) {
                    video.src = stream;
                    video.addEventListener("loadedmetadata", function () {
                        video.play();
                        setStatus("");
                    }, { once: true });
                    return;
                }
                if (window.Hls && window.Hls.isSupported()) {
                    hls = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hls.loadSource(stream);
                    hls.attachMedia(video);
                    hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                        video.play().then(function () {
                            setStatus("");
                        }).catch(function () {
                            setStatus("点击播放器继续观看");
                        });
                    });
                    hls.on(window.Hls.Events.ERROR, function (event, data) {
                        if (data && data.fatal) {
                            setStatus("播放服务暂时无法连接");
                            if (hls) {
                                hls.destroy();
                                hls = null;
                            }
                        }
                    });
                } else {
                    setStatus("播放服务暂不可用");
                }
            }

            if (button) {
                button.addEventListener("click", function (event) {
                    event.preventDefault();
                    playVideo();
                });
            }
            if (video) {
                video.addEventListener("click", function () {
                    if (!started) {
                        playVideo();
                    }
                });
            }
        });
    }

    ready(function () {
        setupNavigation();
        setupImages();
        setupHero();
        setupSearch();
        setupPlayers();
    });
})();
