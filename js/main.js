(function () {
  'use strict';

  // Mobile nav toggle
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav-link');

  function openNav() {
    if (!navMenu) return;
    navMenu.classList.remove('hidden');
    navMenu.setAttribute('aria-hidden', 'false');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    navMenu.querySelector('a')?.focus();
  }

  function closeNav() {
    if (!navMenu) return;
    navMenu.classList.add('hidden');
    navMenu.setAttribute('aria-hidden', 'true');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle?.addEventListener('click', openNav);
  navClose?.addEventListener('click', closeNav);
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  // Navbar scroll effect
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        nav.classList.add('shadow-lg', 'shadow-black/20');
      } else {
        nav.classList.remove('shadow-lg', 'shadow-black/20');
      }
    }, { passive: true });
  }

  // Scroll animations (IntersectionObserver)
  var animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-button').forEach(function (button) {
    button.addEventListener('click', function () {
      var content = this.nextElementSibling;
      var icon = this.querySelector('.faq-icon');
      var isOpen = this.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-button').forEach(function (btn) {
        btn.setAttribute('aria-expanded', 'false');
        btn.nextElementSibling.style.maxHeight = null;
        var otherIcon = btn.querySelector('.faq-icon');
        if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        this.setAttribute('aria-expanded', 'true');
        content.style.maxHeight = content.scrollHeight + 'px';
        if (icon) icon.style.transform = 'rotate(45deg)';
      }
    });
  });

  // Sticky mobile CTA bar
  var stickyCta = document.getElementById('sticky-cta');
  if (stickyCta) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 600) {
        stickyCta.classList.remove('translate-y-full');
      } else {
        stickyCta.classList.add('translate-y-full');
      }
    }, { passive: true });
  }
})();
