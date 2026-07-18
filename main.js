// ===== TwinCode Landing - Main JS =====

(function () {
    'use strict';

    const PHONE = '5355015233'; // WhatsApp number without +

    // ===== SLIDE NAVIGATION =====
    const slides = document.querySelectorAll('.slide');
    const navDots = document.querySelectorAll('.nav-dot');
    let currentSlide = 0;
    let isScrolling = false;

    function goToSlide(index) {
        if (index < 0 || index >= slides.length || isScrolling) return;
        isScrolling = true;

        // Remove active from current
        slides[currentSlide].classList.remove('active');
        navDots[currentSlide].classList.remove('active');

        currentSlide = index;

        // Add active to new
        slides[currentSlide].classList.add('active');
        navDots[currentSlide].classList.add('active');

        // Scroll to slide
        slides[currentSlide].scrollIntoView({ behavior: 'smooth' });

        // Animate stats on hero
        if (currentSlide === 0) {
            animateStats();
        }

        setTimeout(() => {
            isScrolling = false;
        }, 1000);
    }

    // Make goToSlide global for onclick handlers
    window.goToSlide = goToSlide;

    // Navigation dots click
    navDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = parseInt(dot.dataset.slide, 10);
            goToSlide(target);
        });
    });

    // Scroll-based slide detection
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
                const slideIndex = Array.from(slides).indexOf(entry.target);
                if (slideIndex !== -1 && slideIndex !== currentSlide) {
                    slides[currentSlide].classList.remove('active');
                    navDots[currentSlide].classList.remove('active');
                    currentSlide = slideIndex;
                    navDots[currentSlide].classList.add('active');
                    if (currentSlide === 0) animateStats();
                }
            }
        });
    }, {
        threshold: 0.5
    });

    slides.forEach(slide => observer.observe(slide));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            e.preventDefault();
            goToSlide(currentSlide + 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            goToSlide(currentSlide - 1);
        }
    });

    // ===== STATS ANIMATION =====
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        statsAnimated = true;

        document.querySelectorAll('.stat-number[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count, 10);
            const duration = 2000;
            const startTime = performance.now();

            function update(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(target * eased);
                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    el.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });
    }

    // Initial animation
    setTimeout(animateStats, 800);

    // ===== WHATSAPP FORM =====
    window.sendToWhatsApp = function (e) {
        e.preventDefault();

        const form = e.target;
        const nombre = form.nombre.value.trim();
        const telefono = form.telefono.value.trim();
        const servicio = form.servicio.value;
        const negocio = form.negocio.value.trim();
        const descripcion = form.descripcion.value.trim();
        const presupuesto = form.presupuesto.value;
        const plazo = form.plazo.value;

        // Build message
        let message = `Hola TwinCode! 👋\n\n`;
        message += `*Nuevo solicitud de proyecto*\n`;
        message += `━━━━━━━━━━━━━━━━━━━\n\n`;
        message += `*Nombre:* ${nombre}\n`;
        message += `*Teléfono:* ${telefono}\n`;
        message += `*Negocio:* ${negocio || 'No especificado'}\n`;
        message += `*Servicio:* ${servicio}\n`;
        message += `*Presupuesto:* ${presupuesto || 'No especificado'}\n`;
        message += `*Plazo:* ${plazo || 'No especificado'}\n\n`;
        message += `*Descripción del proyecto:*\n${descripcion}`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappURL = `https://wa.me/${PHONE}?text=${encodedMessage}`;

        // Button feedback
        const btn = document.getElementById('submitBtn');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Abriendo WhatsApp...`;
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0.7';

        // Open WhatsApp
        setTimeout(() => {
            window.open(whatsappURL, '_blank');

            // Reset button
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.pointerEvents = '';
                btn.style.opacity = '';
            }, 3000);
        }, 500);
    };

    // ===== MOBILE TOUCH SWIPE =====
    let touchStartY = 0;
    let touchEndY = 0;

    document.addEventListener('touchstart', (e) => {
        // Don't capture swipes on form elements
        if (e.target.closest('.contact-form')) return;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
        if (e.target.closest('.contact-form')) return;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const diff = touchStartY - touchEndY;
        const threshold = 60;

        if (Math.abs(diff) < threshold) return;

        if (diff > 0) {
            // Swipe up - next slide
            goToSlide(currentSlide + 1);
        } else {
            // Swipe down - prev slide
            goToSlide(currentSlide - 1);
        }
    }

    // ===== PARALLAX ON HERO (subtle) =====
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero-bg');
        if (hero && scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${scrollY * 0.3}px)`;
        }
    }, { passive: true });

    // ===== PRELOADER FINISH =====
    document.body.style.opacity = '1';

    console.log('⚡ TwinCode Landing loaded successfully');

})();