(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Nav shadow on scroll ---- */
  var nav = document.querySelector('.site-nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---- Scroll reveal ---- */
  var revealSelectors = [
    '.hero-copy', '.hero-portrait',
    '.approach-intro', '.service-card',
    '.past-work-grid > *', '.testimonial', '.cta-card',
    '.cs-hero .cs-eyebrow', '.cs-hero h1', '.cs-meta',
    '.cs-result-banner h2', '.cs-result-banner p',
    '.cs-challenge .eyebrow', '.cs-challenge h2', '.cs-challenge p.body', '.cs-challenge-photo',
    '.dv-card', '.stats-row-light .stat-card',
    '.timeline-item',
    '.assets-section .eyebrow', '.assets-section h2', '.assets-gallery > *',
    '.cta-simple h2', '.cta-simple p', '.cta-simple .btn',
    '.bio-photo', '.bio-copy', '.value-card',
    '.contact-form', '#form-success'
  ];

  var revealEls = document.querySelectorAll(revealSelectors.join(','));

  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    revealEls.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.setProperty('--reveal-delay', (Math.min(i % 4, 3) * 0.08) + 's');
      el.classList.add('reveal-stagger');
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Count-up stat numbers ---- */
  var nums = document.querySelectorAll('.stat-card .num');
  function animateCount(el) {
    var raw = el.textContent.trim();
    var match = raw.match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!match) return;
    var prefix = match[1], numStr = match[2], suffix = match[3];
    var target = parseFloat(numStr.replace(/,/g, ''));
    if (isNaN(target)) return;
    var decimals = (numStr.split('.')[1] || '').length;
    var hasCommas = numStr.indexOf(',') !== -1;
    var duration = 1100;
    var start = null;

    function format(val) {
      var v = decimals ? val.toFixed(decimals) : Math.round(val).toString();
      if (hasCommas) {
        var parts = v.split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        v = parts.join('.');
      }
      return prefix + v + suffix;
    }

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = format(target * eased);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = raw;
    }
    if (reduceMotion) { el.textContent = raw; return; }
    requestAnimationFrame(step);
  }

  if (nums.length) {
    var countIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          countIo.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { countIo.observe(el); });
  }
})();
