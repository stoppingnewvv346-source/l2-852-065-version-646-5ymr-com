(function () {
    var navToggle = document.querySelector('[data-nav-toggle]');
    var nav = document.querySelector('[data-site-nav]');

    if (navToggle && nav) {
        navToggle.addEventListener('click', function () {
            document.body.classList.toggle('nav-open');
        });

        nav.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                document.body.classList.remove('nav-open');
            });
        });
    }

    var hero = document.querySelector('[data-hero-slider]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        function show(index) {
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

        function play() {
            clearInterval(timer);
            timer = setInterval(function () {
                show(current + 1);
            }, 5200);
        }

        if (prev) {
            prev.addEventListener('click', function () {
                show(current - 1);
                play();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                show(current + 1);
                play();
            });
        }

        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
                play();
            });
        });

        show(0);
        play();
    }

    var searchInput = document.querySelector('[data-search-input]');
    var typeSelect = document.querySelector('[data-type-filter]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('.movie-card'));
    var emptyState = document.querySelector('[data-empty-state]');

    function filterCards() {
        var query = searchInput ? searchInput.value.trim().toLowerCase() : '';
        var type = typeSelect ? typeSelect.value : '';
        var visible = 0;

        cards.forEach(function (card) {
            var haystack = [
                card.getAttribute('data-title'),
                card.getAttribute('data-year'),
                card.getAttribute('data-region'),
                card.getAttribute('data-type'),
                card.getAttribute('data-tags')
            ].join(' ').toLowerCase();
            var matchQuery = !query || haystack.indexOf(query) !== -1;
            var matchType = !type || card.getAttribute('data-type') === type || haystack.indexOf(type.toLowerCase()) !== -1;
            var matched = matchQuery && matchType;

            card.style.display = matched ? '' : 'none';

            if (matched) {
                visible += 1;
            }
        });

        if (emptyState) {
            emptyState.classList.toggle('is-visible', visible === 0);
        }
    }

    if (searchInput) {
        searchInput.addEventListener('input', filterCards);
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', filterCards);
    }
})();
