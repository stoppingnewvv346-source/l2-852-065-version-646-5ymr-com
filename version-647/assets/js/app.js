(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');
  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var active = 0;
    var show = function (index) {
      active = (index + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === active);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === active);
      });
    };
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-hero-dot') || 0));
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        show(active + 1);
      }, 5200);
    }
  }

  var globalSearch = document.querySelector('[data-global-search]');
  if (globalSearch) {
    globalSearch.addEventListener('submit', function (event) {
      event.preventDefault();
      var input = globalSearch.querySelector('input[name="q"]');
      var q = input ? input.value.trim() : '';
      window.location.href = './search.html' + (q ? '?q=' + encodeURIComponent(q) : '');
    });
  }

  var normalize = function (value) {
    return String(value || '').toLowerCase().replace(/\s+/g, '');
  };

  document.querySelectorAll('.filter-panel').forEach(function (panel) {
    var target = document.querySelector(panel.getAttribute('data-target') || '#movie-list');
    if (!target) {
      return;
    }
    var input = panel.querySelector('[data-filter-input]');
    var yearSelect = panel.querySelector('[data-filter-year]');
    var categorySelect = panel.querySelector('[data-filter-category]');
    var sortSelect = panel.querySelector('[data-sort-mode]');
    var cards = Array.prototype.slice.call(target.querySelectorAll('.movie-card'));
    var noResults = document.querySelector('[data-no-results]');
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q && input) {
      input.value = q;
    }

    var compare = function (mode, a, b) {
      if (mode === 'views') {
        return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
      }
      if (mode === 'year') {
        return Number(b.dataset.year || 0) - Number(a.dataset.year || 0);
      }
      if (mode === 'title') {
        return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-CN');
      }
      return Number(b.dataset.score || 0) - Number(a.dataset.score || 0);
    };

    var apply = function () {
      var keyword = normalize(input ? input.value : '');
      var year = yearSelect ? yearSelect.value : '';
      var category = categorySelect ? categorySelect.value : '';
      var mode = sortSelect ? sortSelect.value : 'score';
      var visible = [];
      cards.forEach(function (card) {
        var text = normalize([
          card.dataset.title,
          card.dataset.region,
          card.dataset.genre,
          card.dataset.tags,
          card.dataset.category,
          card.textContent
        ].join(' '));
        var matched = true;
        if (keyword && text.indexOf(keyword) === -1) {
          matched = false;
        }
        if (year && String(card.dataset.year) !== year) {
          matched = false;
        }
        if (category && card.dataset.category !== category) {
          matched = false;
        }
        card.hidden = !matched;
        if (matched) {
          visible.push(card);
        }
      });
      visible.sort(function (a, b) {
        return compare(mode, a, b);
      }).forEach(function (card) {
        target.appendChild(card);
      });
      if (noResults) {
        noResults.classList.toggle('is-visible', visible.length === 0);
      }
    };

    [input, yearSelect, categorySelect, sortSelect].forEach(function (control) {
      if (control) {
        control.addEventListener('input', apply);
        control.addEventListener('change', apply);
      }
    });
    apply();
  });
})();
