(function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');

  if (toggle && header) {
    toggle.addEventListener('click', function () {
      var open = header.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  var slides = Array.prototype.slice.call(document.querySelectorAll('.hero-slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('[data-hero-dot]'));
  var current = 0;

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

  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
    });
  });

  if (slides.length > 1) {
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5200);
  }

  function renderSearchResults(form, query) {
    var box = form.querySelector('.search-results');
    var input = form.querySelector('input[type="search"]');
    var items = window.siteIndex || [];

    if (!box) {
      return;
    }

    var text = (query || '').trim().toLowerCase();

    if (!text) {
      box.classList.remove('is-open');
      box.innerHTML = '';
      return;
    }

    var matched = items.filter(function (item) {
      return item.search.indexOf(text) !== -1;
    }).slice(0, 12);

    if (!matched.length) {
      box.innerHTML = '<div class="search-item"><strong>没有找到相关内容</strong><span>可尝试输入地区、年份、题材或片名</span></div>';
      box.classList.add('is-open');
      return;
    }

    box.innerHTML = matched.map(function (item) {
      return '<a class="search-item" href="./' + item.url + '">' +
        '<img src="' + item.cover + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
        '<span><strong>' + item.title + '</strong><span>' + item.meta + '</span></span>' +
        '</a>';
    }).join('');
    box.classList.add('is-open');

    if (input) {
      input.setAttribute('aria-expanded', 'true');
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('.site-search')).forEach(function (form) {
    var input = form.querySelector('input[type="search"]');

    if (!input) {
      return;
    }

    input.addEventListener('input', function () {
      renderSearchResults(form, input.value);
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      renderSearchResults(form, input.value);
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.site-search')) {
      document.querySelectorAll('.search-results').forEach(function (box) {
        box.classList.remove('is-open');
      });
    }
  });

  var pageInput = document.querySelector('.page-filter-input');
  var list = document.querySelector('[data-card-list]');
  var chips = Array.prototype.slice.call(document.querySelectorAll('[data-filter-value]'));
  var activeType = '全部';

  function filterCards() {
    if (!list) {
      return;
    }

    var text = pageInput ? pageInput.value.trim().toLowerCase() : '';
    Array.prototype.slice.call(list.querySelectorAll('.movie-card')).forEach(function (card) {
      var haystack = [
        card.getAttribute('data-title') || '',
        card.getAttribute('data-type') || '',
        card.getAttribute('data-genre') || '',
        card.getAttribute('data-region') || ''
      ].join(' ').toLowerCase();
      var typeValue = card.getAttribute('data-type') || '';
      var typeOk = activeType === '全部' || typeValue.indexOf(activeType) !== -1 || haystack.indexOf(activeType.toLowerCase()) !== -1;
      var textOk = !text || haystack.indexOf(text) !== -1;
      card.classList.toggle('is-filtered-out', !(typeOk && textOk));
    });
  }

  if (pageInput) {
    pageInput.addEventListener('input', filterCards);
  }

  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      activeType = chip.getAttribute('data-filter-value') || '全部';
      chips.forEach(function (item) {
        item.classList.toggle('is-active', item === chip);
      });
      filterCards();
    });
  });
}());
