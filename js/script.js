// menu toggle & reveal on scroll
document.addEventListener('DOMContentLoaded', function () {
  const mobileBtn = document.getElementById('mobile-menu');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const reveals = document.querySelectorAll('.reveal');
  const navbar = document.getElementById('navbar');

  // Mobile menu toggle
  mobileBtn.addEventListener('click', () => {
    const expanded = mobileBtn.getAttribute('aria-expanded') === 'true';
    mobileBtn.setAttribute('aria-expanded', String(!expanded));
    navMenu.classList.toggle('mobile-open');
  });

  // Close mobile menu on link click (good UX)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // smooth scroll for anchors
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
      // close menu on mobile
      if (navMenu.classList.contains('mobile-open')) {
        navMenu.classList.remove('mobile-open');
        mobileBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Reveal on scroll (IntersectionObserver)
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.12
  };

  const revealObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        // once revealed, stop observing to improve perf
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  reveals.forEach(el => revealObserver.observe(el));

  // Active link on scroll
  const sections = Array.from(document.querySelectorAll('section[id]'));
  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY || window.pageYOffset;
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      const top = rect.top + scrollPos;
      const id = sec.getAttribute('id');
      if (scrollPos >= top - 120 && scrollPos < top + rect.height - 120) {
        document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
        const activeLink = document.querySelector('.nav-link[href="#' + id + '"]');
        if (activeLink) activeLink.classList.add('active');
      }
    });

    // sticky effect: shadow on scroll
    if (scrollPos > 30) {
      navbar.style.boxShadow = '0 8px 28px rgba(0,0,0,0.5)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });

  // Smooth behavior for in-page links (if user clicks anchors outside nav)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
