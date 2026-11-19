// Standpoint Technology: site interactions (no dependencies)
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header: glass background once the page scrolls
  const header = document.querySelector('.site-header');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Highlight the current page in the navigation
  const page = document.body.dataset.page;
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === page) a.setAttribute('aria-current', 'page');
  });

  // Mobile menu
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-menu]');
  if (toggle && menu) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('hidden', !open);
      document.body.classList.toggle('overflow-hidden', open);
      header.classList.toggle('bg-white', open);
      toggle.querySelector('[data-icon-open]').classList.toggle('hidden', open);
      toggle.querySelector('[data-icon-close]').classList.toggle('hidden', !open);
    };
    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
    menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
    window.addEventListener('resize', () => window.innerWidth >= 1024 && setOpen(false));
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Animated counters: <span data-count="150000" data-suffix="+">
  const fmt = new Intl.NumberFormat('en-US');
  const counters = document.querySelectorAll('[data-count]');
  const runCounter = (el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    if (reduceMotion) { el.textContent = fmt.format(end) + suffix; return; }
    const dur = 1600, start = performance.now();
    const tick = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt.format(Math.round(end * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ('IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  } else counters.forEach(runCounter);

  // Cursor spotlight on cards
  document.querySelectorAll('.spotlight').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  // Services page: highlight the section in view in the sticky side menu
  const tocLinks = document.querySelectorAll('[data-toc] a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    const map = new Map([...tocLinks].map((a) => [a.getAttribute('href').slice(1), a]));
    const sio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          tocLinks.forEach((a) => a.removeAttribute('aria-current'));
          const a = map.get(e.target.id);
          if (a) a.setAttribute('aria-current', 'true');
        }
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    map.forEach((_, id) => { const s = document.getElementById(id); if (s) sio.observe(s); });
  }

  // Contact form: no server needed. It opens the visitor's email app with the details filled in.
  // To collect submissions on a server instead, set data-endpoint on the form (e.g. a Formspree
  // or Cloudflare Pages Function URL) and the form will POST there.
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const status = form.querySelector('[data-status]');
    const params = new URLSearchParams(location.search);
    const interest = params.get('interest');
    if (interest && form.interest) form.interest.value = interest;
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const d = Object.fromEntries(new FormData(form));
      if (d.website) return; // spam trap
      const endpoint = form.dataset.endpoint;
      if (endpoint) {
        try {
          const res = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
          if (!res.ok) throw new Error();
          form.reset();
          status.textContent = 'Thank you. Your message has been sent. Our team will be in touch shortly.';
        } catch {
          status.textContent = 'Something went wrong. Please email info@standpointng.com or call +234 201 454 4012.';
        }
        return;
      }
      const subject = `Website enquiry: ${d.interest || 'General'} | ${d.company || d.name}`;
      const body = [
        `Name: ${d.name}`, `Company: ${d.company || '-'}`, `Email: ${d.email}`, `Phone: ${d.phone || '-'}`,
        `Interested in: ${d.interest || '-'}`, '', d.message,
      ].join('\n');
      window.location.href = `mailto:info@standpointng.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      status.textContent = 'Your email app should open with your message ready to send. If it does not, email info@standpointng.com.';
    });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = new Date().getFullYear()));
})();
