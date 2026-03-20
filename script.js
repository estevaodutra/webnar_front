document.addEventListener("DOMContentLoaded", () => {
    // 1. GSAP ENTRANCE ANIMATIONS
    // Make elements visible right before animating to avoid flash
    gsap.set(".animate-element", { autoAlpha: 1 });

    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    // Animate the card container background opacity first
    tl.fromTo(".glass-card",
        { opacity: 0, scale: 0.95, y: 30 },
        { opacity: 1, scale: 1, y: 0, duration: 1.2, clearProps: "all" }
    );

    // Stagger in all elements inside the card
    tl.from(".animate-element", {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
    }, "-=0.8");

    // Add a satisfying bounce to the CTA button specifically
    tl.fromTo(".cta-wrapper",
        { scale: 0.9 },
        { scale: 1, duration: 1.5, ease: "elastic.out(1, 0.3)" },
        "-=0.6"
    );

    // 2. 3D HOVER EFFECT FOR DESKTOP
    const card = document.getElementById("tilt-card");
    const container = document.querySelector(".container");

    // Only apply 3D tilt on devices with hovering capability (desktops)
    if (window.matchMedia("(hover: hover)").matches) {
        container.addEventListener("mousemove", (e) => {
            // Get mouse position relative to the center of the container
            const xAxis = (window.innerWidth / 2 - e.pageX) / 25;
            const yAxis = (window.innerHeight / 2 - e.pageY) / 25;

            // Apply subtle rotation
            card.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;

            // Adjust lighting/border reflection based on mouse
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            card.style.background = `
                radial-gradient(
                    800px circle at ${x}px ${y}px, 
                    rgba(255,255,255,0.06), 
                    transparent 40%
                ),
                rgba(15, 23, 42, 0.4)
            `;
        });

        // Reset transform on mouse leave
        container.addEventListener("mouseleave", () => {
            card.style.transition = "all 0.5s ease";
            card.style.transform = `rotateY(0deg) rotateX(0deg)`;
            card.style.background = `rgba(15, 23, 42, 0.4)`;

            // Remove transition after reset so it doesn't lag on hover again
            setTimeout(() => {
                card.style.transition = "box-shadow 0.3s ease, border-color 0.3s ease";
            }, 500);
        });

        // Set initial transition
        card.addEventListener("mouseenter", () => {
            card.style.transition = "none";
        });
    }

    // 3. CAROUSEL FUNCTIONALITY
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const nextBtn = document.querySelector('.next-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const dots = Array.from(document.querySelectorAll('.slider-dot'));

    if (track && slides.length > 0) {
        let currentIndex = 0;

        function updateCarousel(index) {
            // Update track position
            track.style.transform = `translateX(-${index * 100}%)`;

            // Update dots
            dots.forEach(dot => dot.classList.remove('active'));
            dots[index].classList.add('active');

            currentIndex = index;
        }

        nextBtn.addEventListener('click', () => {
            let nextIndex = currentIndex + 1;
            if (nextIndex >= slides.length) nextIndex = 0; // wrap
            updateCarousel(nextIndex);
        });

        prevBtn.addEventListener('click', () => {
            let prevIndex = currentIndex - 1;
            if (prevIndex < 0) prevIndex = slides.length - 1; // wrap
            updateCarousel(prevIndex);
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateCarousel(index);
            });
        });
    }

});
