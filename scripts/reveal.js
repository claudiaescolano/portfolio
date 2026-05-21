/* reveal.js — scroll-triggered fade-up for sections marked [data-reveal].
 *
 * Important: this script is purely additive. If JS fails, IntersectionObserver
 * is missing, or anything goes wrong, ALL sections stay fully visible. The
 * .reveal opacity-0 starting state is only applied to elements that we've
 * confirmed are below the viewport at page-load — never to anything already
 * visible. That eliminates the "I see empty sections" failure mode where a
 * section was hidden but the observer never fired for it.
 */
(function () {
  'use strict';

  const targets = document.querySelectorAll('[data-reveal]');
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reduced motion or no IntersectionObserver → don't animate, leave
  // everything fully visible.
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

  const viewportH = window.innerHeight;
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.05, rootMargin: '0px 0px 15% 0px' });

  // Only hide + observe elements that are clearly below the initial viewport.
  // Anything already in or near view stays visible from page load.
  targets.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top > viewportH * 0.9) {
      el.classList.add('reveal');
      observer.observe(el);
    }
  });

  // Safety net: force-reveal anything still hidden after 4 seconds, no
  // matter what (programmatic scrolls, weird scroll velocities, etc.).
  setTimeout(() => {
    document.querySelectorAll('[data-reveal].reveal:not(.in)').forEach((el) => el.classList.add('in'));
  }, 4000);
})();
