(function () {
  var header = document.querySelector('.site-header');
  var mobileToggle = document.querySelector('[data-mobile-toggle]');
  var mobilePanel = document.querySelector('[data-mobile-panel]');
  var backTop = document.querySelector('[data-back-top]');

  function updateHeader() {
    if (!header) {
      return;
    }
    if (window.scrollY > 24 || document.body.classList.contains('subpage')) {
      header.classList.add('is-solid');
    } else {
      header.classList.remove('is-solid');
    }
    if (backTop) {
      backTop.classList.toggle('is-visible', window.scrollY > 360);
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (mobileToggle && mobilePanel) {
    mobileToggle.addEventListener('click', function () {
      mobilePanel.classList.toggle('is-open');
    });
  }

  if (backTop) {
    backTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.querySelectorAll('[data-search-form]').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      var input = form.querySelector('input[name="q"]');
      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.location.href = './search.html';
      }
    });
  });

  var hero = document.querySelector('[data-hero-slider]');
  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
        startTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  function normalize(value) {
    return String(value || '').toLowerCase().replace(/\s+/g, ' ').trim();
  }

  document.querySelectorAll('[data-filter-page]').forEach(function (scope) {
    var input = scope.querySelector('[data-filter-search]');
    var genre = scope.querySelector('[data-filter-genre]');
    var type = scope.querySelector('[data-filter-type]');
    var region = scope.querySelector('[data-filter-region]');
    var year = scope.querySelector('[data-filter-year]');
    var empty = scope.querySelector('[data-empty]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-movie-card]'));
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q') || '';

    if (input && query) {
      input.value = query;
    }

    function matchCard(card) {
      var text = normalize(card.getAttribute('data-search'));
      var q = normalize(input && input.value);
      var genreValue = normalize(genre && genre.value);
      var typeValue = normalize(type && type.value);
      var regionValue = normalize(region && region.value);
      var yearValue = normalize(year && year.value);
      var pass = true;

      if (q && text.indexOf(q) === -1) {
        pass = false;
      }
      if (genreValue && normalize(card.getAttribute('data-genre')).indexOf(genreValue) === -1) {
        pass = false;
      }
      if (typeValue && normalize(card.getAttribute('data-type')) !== typeValue) {
        pass = false;
      }
      if (regionValue && normalize(card.getAttribute('data-region')) !== regionValue) {
        pass = false;
      }
      if (yearValue && normalize(card.getAttribute('data-year')) !== yearValue) {
        pass = false;
      }
      return pass;
    }

    function applyFilters() {
      var visible = 0;
      cards.forEach(function (card) {
        var pass = matchCard(card);
        card.hidden = !pass;
        if (pass) {
          visible += 1;
        }
      });
      if (empty) {
        empty.hidden = visible !== 0;
      }
    }

    [input, genre, type, region, year].forEach(function (control) {
      if (control) {
        control.addEventListener('input', applyFilters);
        control.addEventListener('change', applyFilters);
      }
    });

    applyFilters();
  });
})();
