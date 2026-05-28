document.addEventListener("DOMContentLoaded", () => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const slideUpElements = document.querySelectorAll(".slide-up");
    const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    slideUpElements.forEach((el) => scrollObserver.observe(el));

    const navbar = document.querySelector(".navbar");
    const hero = document.querySelector(".hero-section");
    let ticking = false;

    const updateScrollState = () => {
        const scrollY = window.scrollY;
        navbar.classList.toggle("is-scrolled", scrollY > 50);

        if (hero && !prefersReducedMotion) {
            const offset = Math.min(scrollY * 0.16, 120);
            hero.style.setProperty("--hero-offset", `${offset}px`);
        }

        ticking = false;
    };

    const requestScrollUpdate = () => {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollState);
            ticking = true;
        }
    };

    updateScrollState();
    window.addEventListener("scroll", requestScrollUpdate, { passive: true });

    const heroImages = document.querySelectorAll(".hero-bg");
    const heroDots = document.querySelectorAll("[data-hero-dot]");
    const heroCurrent = document.querySelector("[data-hero-current]");
    let heroIndex = 0;
    let heroTimer;

    const setHero = (index) => {
        const nextIndex = (index + heroImages.length) % heroImages.length;

        heroImages[heroIndex].classList.remove("is-active");
        heroDots[heroIndex].classList.remove("is-active");

        heroImages[nextIndex].classList.add("is-active");
        heroDots[nextIndex].classList.add("is-active");
        heroCurrent.textContent = String(nextIndex + 1).padStart(2, "0");
        heroIndex = nextIndex;
    };

    const startHeroTimer = () => {
        if (prefersReducedMotion || heroImages.length < 2) return;
        window.clearInterval(heroTimer);
        heroTimer = window.setInterval(() => {
            setHero(heroIndex + 1);
        }, 5200);
    };

    heroDots.forEach((dot) => {
        dot.addEventListener("click", () => {
            setHero(Number(dot.dataset.heroDot));
            startHeroTimer();
        });
    });

    startHeroTimer();

    const currentYear = new Date().getFullYear();
    const dynamicYearCounters = document.querySelectorAll("[data-start-year]");

    dynamicYearCounters.forEach((counter) => {
        const startYear = Number(counter.dataset.startYear);
        if (Number.isFinite(startYear)) {
            counter.dataset.count = Math.max(currentYear - startYear, 0);
        }
    });

    const counters = document.querySelectorAll("[data-count]");
    const animateCounter = (counter) => {
        const target = Number(counter.dataset.count);
        const duration = 1100;
        const startTime = performance.now();

        const step = (now) => {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.round(target * eased);

            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };

        window.requestAnimationFrame(step);
    };

    if (counters.length) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    if (prefersReducedMotion) {
                        entry.target.textContent = entry.target.dataset.count;
                    } else {
                        animateCounter(entry.target);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.6 });

        counters.forEach((counter) => counterObserver.observe(counter));
    }
});
