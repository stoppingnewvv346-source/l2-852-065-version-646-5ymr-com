(function () {
    var toggles = document.querySelectorAll('[data-menu-toggle]');
    toggles.forEach(function (toggle) {
        toggle.addEventListener('click', function () {
            var menu = document.querySelector('[data-mobile-menu]');
            if (menu) {
                menu.classList.toggle('is-open');
            }
        });
    });

    document.querySelectorAll('[data-hero-carousel]').forEach(function (carousel) {
        var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
        if (!slides.length) {
            return;
        }

        var active = 0;
        var show = function (index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === active);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === active);
            });
        };

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
            });
        });

        show(0);
        window.setInterval(function () {
            show(active + 1);
        }, 5200);
    });

    document.querySelectorAll('[data-filter-root]').forEach(function (root) {
        var input = root.querySelector('[data-filter-input]');
        var region = root.querySelector('[data-filter-region]');
        var type = root.querySelector('[data-filter-type]');
        var year = root.querySelector('[data-filter-year]');
        var cards = Array.prototype.slice.call(root.querySelectorAll('[data-movie-card]'));
        var empty = root.querySelector('[data-empty-state]');

        var normalize = function (value) {
            return (value || '').toString().trim().toLowerCase();
        };

        var apply = function () {
            var keyword = normalize(input && input.value);
            var regionValue = normalize(region && region.value);
            var typeValue = normalize(type && type.value);
            var yearValue = normalize(year && year.value);
            var visible = 0;

            cards.forEach(function (card) {
                var haystack = normalize([
                    card.getAttribute('data-title'),
                    card.getAttribute('data-region'),
                    card.getAttribute('data-type'),
                    card.getAttribute('data-genre'),
                    card.getAttribute('data-year')
                ].join(' '));
                var ok = true;

                if (keyword && haystack.indexOf(keyword) === -1) {
                    ok = false;
                }
                if (regionValue && normalize(card.getAttribute('data-region')) !== regionValue) {
                    ok = false;
                }
                if (typeValue && normalize(card.getAttribute('data-type')) !== typeValue) {
                    ok = false;
                }
                if (yearValue && normalize(card.getAttribute('data-year')) !== yearValue) {
                    ok = false;
                }

                card.style.display = ok ? '' : 'none';
                if (ok) {
                    visible += 1;
                }
            });

            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        };

        [input, region, type, year].forEach(function (control) {
            if (control) {
                control.addEventListener('input', apply);
                control.addEventListener('change', apply);
            }
        });
    });
})();
