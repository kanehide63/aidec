(() => {
  window.dataLayer = window.dataLayer || [];
  const analyticsId = document.querySelector('meta[name="aidec-google-analytics-id"]')?.content.trim();
  if (/^G-[A-Z0-9]+$/i.test(analyticsId || '')) {
    const analyticsScript = document.createElement('script');
    analyticsScript.async = true;
    analyticsScript.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(analyticsId)}`;
    document.head.appendChild(analyticsScript);
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', analyticsId, { anonymize_ip: true });
  }
  window.aidecTrack = (eventName, parameters = {}) => {
    if (typeof window.gtag === 'function') window.gtag('event', eventName, parameters);
    else window.dataLayer.push({ event: eventName, ...parameters });
  };
  document.querySelectorAll('a[href$="application.html"]').forEach(link => {
    link.addEventListener('click', () => window.aidecTrack('free_diagnosis_click', {
      link_text: link.textContent.trim(),
      link_location: link.closest('header') ? 'header' : link.closest('#service') ? 'service' : link.closest('#contact') ? 'contact' : 'other'
    }));
  });
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) window.aidecTrack('faq_open', { question: item.querySelector('summary')?.textContent.trim() || '' });
    });
  });
  if (document.body.dataset.page === 'application') window.aidecTrack('application_form_view');
  if (document.body.dataset.page === 'application-complete') window.aidecTrack('application_submit_success');

  const heroTitle = document.querySelector('.hero-title-animated');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (heroTitle && !reduceMotion) {
    const accessibleText = heroTitle.innerText.replace(/\n+/g, ' ');
    let characterIndex = 0;
    [...heroTitle.childNodes].forEach(node => {
      if (node.nodeType !== Node.TEXT_NODE) return;
      const fragment = document.createDocumentFragment();
      const characters = [...node.textContent];
      const createCharacter = character => {
        const span = document.createElement('span');
        span.className = 'hero-title-char';
        span.setAttribute('aria-hidden', 'true');
        span.style.setProperty('--char-delay', `${450 + characterIndex * 55}ms`);
        span.textContent = character;
        characterIndex += 1;
        return span;
      };
      characters.forEach((character, index) => {
        if (/[、。！？]/.test(characters[index + 1] || '')) {
          const unit = document.createElement('span');
          unit.className = 'hero-title-unit';
          unit.appendChild(createCharacter(character));
          unit.appendChild(createCharacter(characters[index + 1]));
          fragment.appendChild(unit);
          characters[index + 1] = '';
        } else if (character) {
          fragment.appendChild(createCharacter(character));
        }
      });
      node.replaceWith(fragment);
    });
    heroTitle.setAttribute('aria-label', accessibleText);
    heroTitle.classList.add('is-typing');
  }

  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('.site-nav');
  const header = document.querySelector('.site-header');
  const progressBar = document.querySelector('.scroll-progress span');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!open));
      menuButton.setAttribute('aria-label', open ? 'メニューを開く' : 'メニューを閉じる');
      nav.classList.toggle('open', !open);
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'メニューを開く');
      nav.classList.remove('open');
    }));
  }
  const onScroll = () => {
    header?.classList.toggle('scrolled', window.scrollY > 8);
    if (progressBar) {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    }
  };
  onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
  const year = document.getElementById('year'); if (year) year.textContent = new Date().getFullYear();
  const items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.12 });
    items.forEach(item => observer.observe(item));
  } else { items.forEach(item => item.classList.add('is-visible')); }
})();
