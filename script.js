document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        document.body.classList.add('index-page');
    }
    
    // Prevent default scroll behavior during transition
    let isTransitioning = false;
    
    window.addEventListener('wheel', function(e) {
        if (isTransitioning) {
            e.preventDefault();
        }
    }, { passive: false });
});
