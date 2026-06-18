document.addEventListener('DOMContentLoaded', function () {
    initializeMobileMenu();
    initializeHeroCarousel();
    initializeFilters();
    initializeSearchQuery();
    initializePlayerScroll();
});

function initializeMobileMenu() {
    var button = document.querySelector('[data-mobile-menu-button]');
    var menu = document.querySelector('[data-mobile-menu]');

    if (!button || !menu) {
        return;
    }

    button.addEventListener('click', function () {
        menu.classList.toggle('is-open');
    });
}

function initializeHeroCarousel() {
    var carousel = document.querySelector('[data-hero-carousel]');

    if (!carousel) {
        return;
    }

    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var previous = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var index = 0;
    var timer = null;

    function showSlide(nextIndex) {
        index = (nextIndex + slides.length) % slides.length;

        slides.forEach(function (slide, slideIndex) {
            slide.classList.toggle('is-active', slideIndex === index);
        });

        dots.forEach(function (dot, dotIndex) {
            dot.classList.toggle('is-active', dotIndex === index);
        });
    }

    function restartTimer() {
        window.clearInterval(timer);
        timer = window.setInterval(function () {
            showSlide(index + 1);
        }, 5000);
    }

    if (previous) {
        previous.addEventListener('click', function () {
            showSlide(index - 1);
            restartTimer();
        });
    }

    if (next) {
        next.addEventListener('click', function () {
            showSlide(index + 1);
            restartTimer();
        });
    }

    dots.forEach(function (dot, dotIndex) {
        dot.addEventListener('click', function () {
            showSlide(dotIndex);
            restartTimer();
        });
    });

    restartTimer();
}

function initializeSearchQuery() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get('q');
    var input = document.querySelector('[data-filter-keyword]');

    if (query && input) {
        input.value = query;
        input.dispatchEvent(new Event('input'));
    }
}

function initializeFilters() {
    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

    panels.forEach(function (panel) {
        var list = panel.parentElement.querySelector('[data-movie-list]');

        if (!list) {
            return;
        }

        var cards = Array.prototype.slice.call(list.querySelectorAll('.js-movie-card'));
        var keywordInput = panel.querySelector('[data-filter-keyword]');
        var typeSelect = panel.querySelector('[data-filter-type]');
        var yearSelect = panel.querySelector('[data-filter-year]');
        var sortSelect = panel.querySelector('[data-sort-select]');
        var countBox = panel.querySelector('[data-result-count]');

        function matchesYear(cardYear, selectedYear) {
            if (!selectedYear) {
                return true;
            }

            var year = Number((cardYear || '').replace(/\D/g, '').slice(0, 4));

            if (selectedYear === '2020') {
                return year >= 2020 && year <= 2029;
            }

            if (selectedYear === '2010') {
                return year >= 2010 && year <= 2019;
            }

            if (selectedYear === '2000') {
                return year >= 2000 && year <= 2009;
            }

            if (selectedYear === '1990') {
                return year > 0 && year <= 1999;
            }

            return String(year) === selectedYear;
        }

        function applyFilter() {
            var keyword = (keywordInput ? keywordInput.value : '').trim().toLowerCase();
            var selectedType = typeSelect ? typeSelect.value : '';
            var selectedYear = yearSelect ? yearSelect.value : '';
            var visibleCards = [];

            cards.forEach(function (card) {
                var haystack = [
                    card.dataset.title,
                    card.dataset.region,
                    card.dataset.year,
                    card.dataset.type,
                    card.dataset.genre
                ].join(' ').toLowerCase();
                var typeText = card.dataset.type || '';
                var typeMatched = !selectedType || typeText.indexOf(selectedType) !== -1;
                var yearMatched = matchesYear(card.dataset.year, selectedYear);
                var keywordMatched = !keyword || haystack.indexOf(keyword) !== -1;
                var matched = typeMatched && yearMatched && keywordMatched;

                card.style.display = matched ? '' : 'none';

                if (matched) {
                    visibleCards.push(card);
                }
            });

            sortCards(visibleCards, sortSelect ? sortSelect.value : 'default', list);

            if (countBox) {
                countBox.textContent = String(visibleCards.length);
            }
        }

        function sortCards(visibleCards, mode, listNode) {
            var sorted = visibleCards.slice();

            if (mode === 'views') {
                sorted.sort(function (a, b) {
                    return Number(b.dataset.views || 0) - Number(a.dataset.views || 0);
                });
            } else if (mode === 'likes') {
                sorted.sort(function (a, b) {
                    return Number(b.dataset.likes || 0) - Number(a.dataset.likes || 0);
                });
            } else if (mode === 'year') {
                sorted.sort(function (a, b) {
                    return Number((b.dataset.year || '').replace(/\D/g, '').slice(0, 4) || 0) - Number((a.dataset.year || '').replace(/\D/g, '').slice(0, 4) || 0);
                });
            } else if (mode === 'title') {
                sorted.sort(function (a, b) {
                    return (a.dataset.title || '').localeCompare(b.dataset.title || '', 'zh-Hans-CN');
                });
            }

            sorted.forEach(function (card) {
                listNode.appendChild(card);
            });
        }

        [keywordInput, typeSelect, yearSelect, sortSelect].forEach(function (control) {
            if (control) {
                control.addEventListener('input', applyFilter);
                control.addEventListener('change', applyFilter);
            }
        });

        applyFilter();
    });
}

function initializePlayerScroll() {
    var trigger = document.querySelector('[data-scroll-player]');
    var player = document.querySelector('.player-section');

    if (!trigger || !player) {
        return;
    }

    trigger.addEventListener('click', function (event) {
        event.preventDefault();
        player.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
}
