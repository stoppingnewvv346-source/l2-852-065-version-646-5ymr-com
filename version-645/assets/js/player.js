(function() {
  const video = document.getElementById("moviePlayer");
  const overlay = document.getElementById("playerOverlay");
  const payload = document.getElementById("videoPayload");

  if (!video || !overlay || !payload) {
    return;
  }

  let url = "";
  try {
    url = JSON.parse(payload.textContent || "{}").url || "";
  } catch (error) {
    url = "";
  }

  let ready = false;
  let hls = null;

  function attachVideo() {
    if (ready || !url) {
      return;
    }

    if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = url;
      ready = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(url);
      hls.attachMedia(video);
      ready = true;
      return;
    }

    video.src = url;
    ready = true;
  }

  function playMovie() {
    attachVideo();
    overlay.classList.add("is-hidden");
    video.controls = true;
    const action = video.play();
    if (action && typeof action.catch === "function") {
      action.catch(function() {
        overlay.classList.remove("is-hidden");
      });
    }
  }

  overlay.addEventListener("click", playMovie);
  video.addEventListener("click", function() {
    if (!ready || video.paused) {
      playMovie();
    }
  });

  window.addEventListener("pagehide", function() {
    if (hls && typeof hls.destroy === "function") {
      hls.destroy();
    }
  });
})();
