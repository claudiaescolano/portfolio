/* reveal.js — scroll-triggered fade-up for sections marked [data-reveal].
 * Add `data-reveal` to any element you want to fade in as it enters
 * the viewport. The observer assigns .reveal (initial state from
 * tokens.css) and toggles .reveal.in once intersecting, then unobserves.
 */
(function () {
  'use strict';

  // Skip animation entirely if the user prefers reduced motion.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = document.querySelectorAll('[data-reveal]');

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    targets.forEach((el) => el.classList.add('reveal', 'in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.05, rootMargin: '0px 0px 15% 0px' });

  targets.forEach((el) => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Safety net: if a section somehow never triggers the observer
  // (unusual scroll pattern, programmatic scroll, etc.), force-reveal
  // anything still hidden after 4 seconds. Prevents permanently
  // invisible content under any browser quirk.
  setTimeout(() => {
    document.querySelectorAll('[data-reveal]:not(.in)').forEach((el) => el.classList.add('in'));
  }, 4000);
})();
