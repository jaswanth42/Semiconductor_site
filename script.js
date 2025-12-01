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
});
document.querySelectorAll(".caa-card").forEach(card => {
    card.addEventListener("click", () => {
        document.querySelectorAll(".caa-card").forEach(c => c.classList.remove("active"));
        card.classList.add("active");

        const target = document.getElementById(card.dataset.target);
        if (target) {
            target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    });
});

