// Intersection Observer for scroll animations
document.addEventListener("DOMContentLoaded", () => {
    const slideUpElements = document.querySelectorAll('.slide-up');

    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    slideUpElements.forEach(el => {
        scrollObserver.observe(el);
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = "1rem 5%";
            navbar.style.background = "rgba(10, 10, 10, 0.95)";
        } else {
            navbar.style.padding = "1.5rem 5%";
            navbar.style.background = "rgba(10, 10, 10, 0.8)";
        }
    });
});
