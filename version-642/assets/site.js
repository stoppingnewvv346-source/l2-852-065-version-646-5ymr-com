(function () {
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.querySelector('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.textContent = open ? '×' : '☰';
    });
  }

  var carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('.hero-dot'));
    var prev = carousel.querySelector('[data-prev]');
    var next = carousel.querySelector('[data-next]');
    var index = 0;

    function show(target) {
      if (!slides.length) {
        return;
      }
      index = (target + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-slide')) || 0);
      });
    });
    window.setInterval(function () {
      show(index + 1);
    }, 5200);
  }

  function filterCards(input) {
    var section = input.closest('main') || document;
    var cards = Array.prototype.slice.call(section.querySelectorAll('.searchable-card'));
    var value = input.value.trim().toLowerCase();
    cards.forEach(function (card) {
      var source = (card.getAttribute('data-search') || card.textContent || '').toLowerCase();
      card.classList.toggle('is-hidden', value && source.indexOf(value) === -1);
    });
  }

  var inputs = Array.prototype.slice.call(document.querySelectorAll('.local-filter'));
  inputs.forEach(function (input) {
    input.addEventListener('input', function () {
      filterCards(input);
    });
  });

  var clearButtons = Array.prototype.slice.call(document.querySelectorAll('.clear-filter'));
  clearButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var scope = button.closest('form') || document;
      var input = scope.querySelector('.local-filter');
      if (input) {
        input.value = '';
        filterCards(input);
        input.focus();
      }
    });
  });

  var params = new URLSearchParams(window.location.search);
  var query = params.get('q');
  var searchInput = document.querySelector('.search-query');
  if (query && searchInput) {
    searchInput.value = query;
    filterCards(searchInput);
  }
})();
