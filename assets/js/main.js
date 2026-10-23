const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Header state
(() => {
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// Scroll reveal (once)
(() => {
  const items = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window) || reduceMotion) {
    items.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  // Stagger siblings that enter together
  document.querySelectorAll('.rows, .photo-col').forEach(group => {
    group.querySelectorAll('[data-reveal]').forEach((el, i) => el.style.setProperty('--i', Math.min(i, 4)));
  });
  items.forEach(el => io.observe(el));
})();

// Active nav link
(() => {
  const links = document.querySelectorAll('.nav-link');
  const map = new Map();
  links.forEach(link => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) map.set(target, link);
  });
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const link = map.get(entry.target);
      if (link) link.classList.toggle('is-active', entry.isIntersecting);
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  map.forEach((_, section) => io.observe(section));
})();

// Mobile menu
(() => {
  const toggle = document.getElementById('menuToggle');
  const menu = document.getElementById('mobileMenu');
  const set = (open) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Fermer' : 'Menu';
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => set(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => set(false)));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) set(false);
  });
})();

// Cursor-follow preview on rows
(() => {
  if (!canHover) return;
  const box = document.getElementById('hoverPreview');
  const img = box.querySelector('img');
  let tx = 0, ty = 0, x = 0, y = 0, raf = null, active = false;

  const tick = () => {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;
    box.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${active ? 1 : 0.92})`;
    raf = active || Math.abs(tx - x) > 0.5 ? requestAnimationFrame(tick) : null;
  };

  document.querySelectorAll('[data-preview]').forEach(row => {
    row.addEventListener('mouseenter', (e) => {
      img.src = row.dataset.preview;
      active = true;
      tx = x = e.clientX + 24;
      ty = y = e.clientY - 80;
      box.classList.add('is-visible');
      if (!raf) raf = requestAnimationFrame(tick);
    });
    row.addEventListener('mousemove', (e) => {
      tx = e.clientX + 24;
      ty = e.clientY - 80;
    });
    row.addEventListener('mouseleave', () => {
      active = false;
      box.classList.remove('is-visible');
    });
  });
})();

// Featured video: muted preview on hover (desktop only)
(() => {
  if (!canHover || reduceMotion) return;
  const card = document.querySelector('.featured');
  if (!card) return;
  const id = card.dataset.videoId;
  let timer = null, iframe = null;

  card.addEventListener('mouseenter', () => {
    timer = setTimeout(() => {
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&loop=1&playlist=${id}&playsinline=1`;
        iframe.setAttribute('allow', 'autoplay; encrypted-media');
        iframe.setAttribute('tabindex', '-1');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.title = '';
        card.insertBefore(iframe, card.querySelector('.featured-caption'));
      }
      card.classList.add('is-previewing');
    }, 350);
  });

  card.addEventListener('mouseleave', () => {
    clearTimeout(timer);
    card.classList.remove('is-previewing');
    if (iframe) {
      const old = iframe;
      iframe = null;
      setTimeout(() => old.remove(), 400);
    }
  });
})();

// Lightbox
(() => {
  const dialog = document.getElementById('lightbox');
  const img = document.getElementById('lbImg');
  const count = document.getElementById('lbCount');
  const title = document.getElementById('lbTitle');
  const shots = Array.from(document.querySelectorAll('.shot'));
  let index = 0;

  const pad = (n) => String(n).padStart(2, '0');

  const show = (i) => {
    index = (i + shots.length) % shots.length;
    const shot = shots[index];
    img.src = shot.dataset.full;
    img.alt = shot.querySelector('img').alt;
    count.textContent = `${pad(index + 1)} / ${pad(shots.length)}`;
    title.textContent = shot.dataset.title;
  };

  shots.forEach((shot, i) => {
    shot.addEventListener('click', () => {
      show(i);
      dialog.showModal();
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => dialog.close();
  dialog.addEventListener('close', () => {
    document.body.style.overflow = '';
    img.src = '';
    shots[index].focus({ preventScroll: true });
  });

  document.getElementById('lbClose').addEventListener('click', close);
  document.getElementById('lbPrev').addEventListener('click', () => show(index - 1));
  document.getElementById('lbNext').addEventListener('click', () => show(index + 1));
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || e.target.classList.contains('lb-stage')) close();
  });
  dialog.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
})();
