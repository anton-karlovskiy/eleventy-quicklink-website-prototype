function lazyLoad() {
    Array.prototype.forEach.call(document.querySelectorAll('div[data-type="lazy"]'), (el) => {
        if ((el.getBoundingClientRect().top - window.innerHeight) <= 0) {
            const newEl = document.createElement(el.dataset.tag);
            Array.prototype.forEach.call(el.attributes, (attr) => {
                newEl.setAttribute(attr.name, attr.value);
            })
            el.parentNode.replaceChild(newEl, el);
        }
    });
}

function initGoToTopBtn() {
    const goTopBtn = document.querySelector('.back-to-top');

    function trackScroll() {
        const scrolled = window.pageYOffset;
        const threshold = 400;

        if (scrolled > threshold) {
            goTopBtn.classList.remove('hidden');
        }
        if (scrolled < threshold) {
            goTopBtn.classList.add('hidden');
        }
    }

    function scrollToTop() {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c > 0) {
          window.requestAnimationFrame(scrollToTop);
          window.scrollTo(0, c - c / 8);
        }
    }

    function backToTop() {
        if (window.pageYOffset > 0) {
            scrollToTop();
        }
    }

    window.addEventListener('scroll', trackScroll, { passive: true });
    goTopBtn.addEventListener('click', backToTop);
};

lazyLoad();
initGoToTopBtn();
window.addEventListener('scroll', lazyLoad, { passive: true });
