import { gsap } from 'gsap';

// Navbar animations
export const animateNavbarLinks = () => {
    gsap.fromTo('.navbar-link', {
        opacity: 0,
        y: -10
    }, {
        opacity: 1,
        y: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out'
    });
};

export const animateNavbarBrand = () => {
    gsap.fromTo('.navbar-brand', {
        opacity: 0,
        x: -20
    }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out'
    });
};

// Card animations
export const animateBentoCards = () => {
  gsap.fromTo('.bento-card', {
    scale: 0.95,
    opacity: 0
  }, {
    scale: 1,
    opacity: 1,
    stagger: 0.15,
    duration: 0.8,
    ease: 'expo.out'
  });
};

// Button animations
export const animateButtonHover = (element, entering) => {
  gsap.to(element, {
    scale: entering ? 1.05 : 1,
    duration: 0.25,
    ease: 'power2.out'
  });
};

export const animateButtonClick = (element) => {
  gsap.to(element, {
    keyframes: [
      { scale: 0.95, duration: 0.15 },
      { scale: 1, duration: 0.15 }
    ],
    ease: 'power2.out'
  });
};

// Hero section animations
export const animateHeroText = () => {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.fromTo('.hero-heading-1', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 })
    .fromTo('.hero-heading-2', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
    .fromTo('.hero-heading-3', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.6')
    .fromTo('.hero-description', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, '-=0.4');
};

// Search input animations
export const animateSearchBar = () => {
  gsap.fromTo('.search-container', {
    opacity: 0,
    y: 20
  }, {
    opacity: 1,
    y: 0,
    duration: 0.8,
    delay: 1,
    ease: 'power2.out'
  });
};

// Stats counter animation
export const animateCounters = () => {
  const counters = document.querySelectorAll('.counter-value');
  counters.forEach(counter => {
    const target = parseFloat(counter.getAttribute('data-target'));
    const prefix = counter.getAttribute('data-prefix') || '';
    const suffix = counter.getAttribute('data-suffix') || '';
    const decimals = parseInt(counter.getAttribute('data-decimals') || '0', 10);
    const duration = parseFloat(counter.getAttribute('data-duration') || '2');
    gsap.fromTo({ value: 0 }, { value: target, duration: duration, ease: 'expo.inOut',
      onUpdate: function() {
        counter.innerHTML = prefix + this.targets()[0].value.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      }
    });
  });
};

// Page transition animations
export const pageEnterAnimation = () => {
  gsap.fromTo('.page-content', {
    opacity: 0,
    y: 10
  }, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out'
  });
};

// Mobile menu animations
export const animateMobileMenu = (isOpen) => {
    if (isOpen) {
        gsap.fromTo('.mobile-menu', {
            opacity: 0,
            y: -10
        }, {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: 'power3.out'
        });
    } else {
        gsap.to('.mobile-menu', {
            opacity: 0,
            y: -10,
            duration: 0.2,
            ease: 'power1.in'
        });
    }
};

// Chart animations
export const animateCharts = () => {
  gsap.fromTo('.chart-container', {
    opacity: 0,
    y: 20
  }, {
    opacity: 1,
    y: 0,
    stagger: 0.2,
    duration: 0.8,
    ease: 'power2.out'
  });
};

// Loader animations
export const animateLoader = (isLoading) => {
  if (isLoading) {
    gsap.fromTo('.loader-container', {
      opacity: 0,
      scale: 0.9
    }, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
      onStart: function() {
        document.querySelector('.loader-container').style.display = 'flex';
      }
    });
  } else {
    gsap.to('.loader-container', {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: function() {
        document.querySelector('.loader-container').style.display = 'none';
      }
    });
  }
};