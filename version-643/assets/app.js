(function () {
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  function $all(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function initHeader() {
    var header = $('[data-header]');
    var toggle = $('[data-menu-toggle]');
    var panel = $('[data-mobile-panel]');

    if (header) {
      var update = function () {
        header.classList.toggle('scrolled', window.scrollY > 18);
      };
      update();
      window.addEventListener('scroll', update, { passive: true });
    }

    if (toggle && panel) {
      toggle.addEventListener('click', function () {
        panel.classList.toggle('open');
        toggle.textContent = panel.classList.contains('open') ? '×' : '☰';
      });
    }
  }

  function initHero() {
    var slider = $('[data-hero-slider]');
    if (!slider) {
      return;
    }

    var slides = $all('[data-hero-slide]', slider);
    var dots = $all('[data-hero-dot]', slider);
    var index = 0;

    function activate(next) {
      if (!slides.length) {
        return;
      }
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        activate(Number(dot.getAttribute('data-hero-dot')) || 0);
      });
    });

    if (slides.length > 1) {
      window.setInterval(function () {
        activate(index + 1);
      }, 5200);
    }
  }

  function initLocalTools() {
    var list = $('[data-card-list]');
    var sort = $('[data-sort-select]');
    var filter = $('[data-local-filter]');

    if (!list) {
      return;
    }

    function cards() {
      return $all('[data-movie-card]', list);
    }

    function applyFilter() {
      var term = filter ? filter.value.trim().toLowerCase() : '';
      cards().forEach(function (card) {
        var haystack = (card.getAttribute('data-search') || '').toLowerCase();
        card.classList.toggle('is-hidden-card', term && haystack.indexOf(term) === -1);
      });
    }

    function applySort() {
      if (!sort) {
        return;
      }
      var mode = sort.value;
      var sorted = cards().sort(function (a, b) {
        if (mode === 'rating') {
          return Number(b.getAttribute('data-rating')) - Number(a.getAttribute('data-rating'));
        }
        if (mode === 'views') {
          return Number(b.getAttribute('data-views')) - Number(a.getAttribute('data-views'));
        }
        if (mode === 'title') {
          return (a.getAttribute('data-title') || '').localeCompare(b.getAttribute('data-title') || '', 'zh-Hans-CN');
        }
        return (b.getAttribute('data-date') || '').localeCompare(a.getAttribute('data-date') || '');
      });
      sorted.forEach(function (card) {
        list.appendChild(card);
      });
      applyFilter();
    }

    if (filter) {
      filter.addEventListener('input', applyFilter);
    }
    if (sort) {
      sort.addEventListener('change', applySort);
      applySort();
    }
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (match) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[match];
    });
  }

  function renderSearchCard(movie) {
    var tags = (movie.tags || []).slice(0, 3).map(function (tag) {
      return '<span>' + escapeHtml(tag) + '</span>';
    }).join('');

    return '<article class="movie-card">' +
      '<a class="poster-link" href="' + escapeHtml(movie.url) + '">' +
      '<img src="' + escapeHtml(movie.cover) + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">' +
      '<span class="poster-play">▶</span>' +
      '<span class="duration">' + escapeHtml(movie.duration) + '</span>' +
      '</a>' +
      '<div class="movie-card-body">' +
      '<a class="category-pill" href="' + escapeHtml(movie.categoryUrl) + '">' + escapeHtml(movie.category) + '</a>' +
      '<h2><a href="' + escapeHtml(movie.url) + '">' + escapeHtml(movie.title) + '</a></h2>' +
      '<p>' + escapeHtml(movie.description) + '</p>' +
      '<div class="tag-row">' + tags + '</div>' +
      '<div class="movie-meta"><span>' + escapeHtml(movie.year) + '</span><span>' + escapeHtml(movie.region) + '</span><span>' + escapeHtml(movie.rating) + '分</span></div>' +
      '</div>' +
      '</article>';
  }

  function initSearchPage() {
    var results = $('[data-search-results]');
    var input = $('[data-search-input]');
    var title = $('[data-search-title]');
    var note = $('[data-search-note]');

    if (!results || !window.SITE_MOVIES) {
      return;
    }

    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    if (input) {
      input.value = query;
    }
    if (!query) {
      return;
    }

    var lower = query.toLowerCase();
    var matches = window.SITE_MOVIES.filter(function (movie) {
      return [
        movie.title,
        movie.description,
        movie.category,
        movie.region,
        movie.genre,
        movie.year,
        (movie.tags || []).join(' ')
      ].join(' ').toLowerCase().indexOf(lower) !== -1;
    });

    if (title) {
      title.textContent = '搜索：' + query;
    }
    if (note) {
      note.textContent = matches.length ? '已为你匹配相关剧集内容。' : '暂未找到匹配内容，可尝试更换关键词。';
    }
    results.innerHTML = matches.slice(0, 240).map(renderSearchCard).join('');
  }

  document.addEventListener('DOMContentLoaded', function () {
    initHeader();
    initHero();
    initLocalTools();
    initSearchPage();
  });
})();
