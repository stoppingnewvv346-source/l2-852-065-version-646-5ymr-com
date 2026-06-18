(function() {
  const depth = Number(document.documentElement.getAttribute("data-depth") || "0");
  const base = depth > 0 ? "../" : "./";

  function resolve(path) {
    if (!path) {
      return base;
    }
    if (/^(https?:)?\/\//.test(path)) {
      return path;
    }
    return base + String(path).replace(/^\.\//, "").replace(/^\//, "");
  }

  const menuButton = document.querySelector("[data-menu-toggle]");
  const mobileMenu = document.querySelector("[data-mobile-menu]");

  if (menuButton && mobileMenu) {
    menuButton.addEventListener("click", function() {
      mobileMenu.classList.toggle("is-open");
    });
  }

  const overlay = document.getElementById("searchOverlay");
  const searchInput = document.getElementById("globalSearchInput");
  const searchResults = document.getElementById("searchResults");
  const openButtons = document.querySelectorAll("[data-open-search]");
  const closeButtons = document.querySelectorAll("[data-close-search]");

  function clearSearch() {
    if (searchResults) {
      searchResults.innerHTML = "";
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "输入关键词开始搜索";
      searchResults.appendChild(empty);
    }
  }

  function openSearch() {
    if (!overlay) {
      return;
    }
    overlay.hidden = false;
    document.body.classList.add("no-scroll");
    clearSearch();
    if (searchInput) {
      searchInput.value = "";
      setTimeout(function() {
        searchInput.focus();
      }, 30);
    }
  }

  function closeSearch() {
    if (!overlay) {
      return;
    }
    overlay.hidden = true;
    document.body.classList.remove("no-scroll");
  }

  function appendResult(item) {
    const link = document.createElement("a");
    link.className = "search-result";
    link.href = resolve(item.url);

    const img = document.createElement("img");
    img.src = resolve(item.cover);
    img.alt = item.title || "";
    img.loading = "lazy";

    const body = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.title || "";
    const line = document.createElement("p");
    line.textContent = item.oneLine || "";
    const meta = document.createElement("span");
    meta.textContent = [item.year, item.region, item.type].filter(Boolean).join(" · ");

    body.appendChild(title);
    body.appendChild(line);
    body.appendChild(meta);
    link.appendChild(img);
    link.appendChild(body);
    searchResults.appendChild(link);
  }

  function renderSearch(query) {
    if (!searchResults) {
      return;
    }
    searchResults.innerHTML = "";
    const keyword = query.trim().toLowerCase();
    if (!keyword) {
      clearSearch();
      return;
    }
    const source = Array.isArray(window.SEARCH_MOVIES) ? window.SEARCH_MOVIES : [];
    const hits = source.filter(function(item) {
      const text = [item.title, item.oneLine, item.region, item.type, item.year, item.category, item.tags]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return text.indexOf(keyword) !== -1;
    }).slice(0, 24);

    if (!hits.length) {
      const empty = document.createElement("div");
      empty.className = "search-empty";
      empty.textContent = "未找到相关内容";
      searchResults.appendChild(empty);
      return;
    }

    hits.forEach(appendResult);
  }

  openButtons.forEach(function(button) {
    button.addEventListener("click", openSearch);
  });

  closeButtons.forEach(function(button) {
    button.addEventListener("click", closeSearch);
  });

  if (overlay) {
    overlay.addEventListener("click", function(event) {
      if (event.target === overlay) {
        closeSearch();
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", function(event) {
      renderSearch(event.target.value);
    });
  }

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      closeSearch();
    }
  });

  const slides = Array.from(document.querySelectorAll(".hero-slide"));
  const dots = Array.from(document.querySelectorAll(".hero-dot"));
  const prev = document.querySelector("[data-hero-prev]");
  const next = document.querySelector("[data-hero-next]");
  let active = 0;
  let timer = null;

  function showSlide(index) {
    if (!slides.length) {
      return;
    }
    active = (index + slides.length) % slides.length;
    slides.forEach(function(slide, slideIndex) {
      slide.classList.toggle("is-active", slideIndex === active);
    });
    dots.forEach(function(dot, dotIndex) {
      dot.classList.toggle("is-active", dotIndex === active);
    });
  }

  function startHero() {
    if (timer || slides.length < 2) {
      return;
    }
    timer = setInterval(function() {
      showSlide(active + 1);
    }, 5200);
  }

  function resetHero() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    startHero();
  }

  if (slides.length) {
    showSlide(0);
    startHero();
  }

  if (prev) {
    prev.addEventListener("click", function() {
      showSlide(active - 1);
      resetHero();
    });
  }

  if (next) {
    next.addEventListener("click", function() {
      showSlide(active + 1);
      resetHero();
    });
  }

  dots.forEach(function(dot, index) {
    dot.addEventListener("click", function() {
      showSlide(index);
      resetHero();
    });
  });

  const cardFilter = document.querySelector("[data-card-filter]");
  if (cardFilter) {
    cardFilter.addEventListener("input", function(event) {
      const keyword = event.target.value.trim().toLowerCase();
      document.querySelectorAll("[data-search-card]").forEach(function(card) {
        const text = (card.getAttribute("data-search-card") || "").toLowerCase();
        card.classList.toggle("is-filtered-out", keyword && text.indexOf(keyword) === -1);
      });
    });
  }
})();
