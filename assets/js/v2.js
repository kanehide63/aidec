(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#main-nav');
  const close = () => { nav?.classList.remove('is-open'); toggle?.setAttribute('aria-expanded', 'false'); };
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open)); nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (nav?.classList.contains('is-open')) {
      close(); document.querySelectorAll('.service-menu[open]').forEach(menu => { menu.open = false; });
      toggle.focus(); return;
    }
    document.querySelectorAll('.service-menu[open]').forEach(menu => { menu.open = false; menu.querySelector('summary').focus(); });
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.v2-header')) {
      close(); document.querySelectorAll('.service-menu[open]').forEach(menu => { menu.open = false; });
    }
  });
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', close));
  window.matchMedia('(min-width: 961px)').addEventListener('change', close);
  const heroTitle = document.querySelector('.home-hero-title');
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
        span.className = 'home-hero-title-char';
        span.setAttribute('aria-hidden', 'true');
        span.style.setProperty('--character-delay', `${180 + characterIndex * 42}ms`);
        span.textContent = character;
        characterIndex += 1;
        return span;
      };
      characters.forEach((character, index) => {
        if (/[、。！？]/.test(characters[index + 1] || '')) {
          const unit = document.createElement('span');
          unit.className = 'home-hero-title-unit';
          unit.append(createCharacter(character), createCharacter(characters[index + 1]));
          fragment.appendChild(unit);
          characters[index + 1] = '';
        } else if (character) {
          fragment.appendChild(createCharacter(character));
        }
      });
      node.replaceWith(fragment);
    });
    heroTitle.setAttribute('aria-label', accessibleText);
    heroTitle.classList.add('is-character-revealing');
  }
  const sectionTitles = document.querySelectorAll('#about .section-head h2, #service .section-head h2, #approach .section-head h2, #case-studies .section-head h2');
  if (!reduceMotion) {
    sectionTitles.forEach(title => {
      const accessibleText = title.innerText.replace(/\n+/g, ' ');
      let characterIndex = 0;
      [...title.childNodes].forEach(node => {
        if (node.nodeType !== Node.TEXT_NODE) return;
        const fragment = document.createDocumentFragment();
        const characters = [...node.textContent];
        const createCharacter = character => {
          const span = document.createElement('span');
          span.className = 'section-title-char';
          span.setAttribute('aria-hidden', 'true');
          span.style.setProperty('--character-delay', `${80 + characterIndex * 42}ms`);
          span.textContent = character;
          characterIndex += 1;
          return span;
        };
        characters.forEach((character, index) => {
          if (/[、。！？]/.test(characters[index + 1] || '')) {
            const unit = document.createElement('span');
            unit.className = 'section-title-unit';
            unit.append(createCharacter(character), createCharacter(characters[index + 1]));
            fragment.appendChild(unit);
            characters[index + 1] = '';
          } else if (character) {
            fragment.appendChild(createCharacter(character));
          }
        });
        node.replaceWith(fragment);
      });
      title.setAttribute('aria-label', accessibleText);
      title.classList.add('section-character-title', 'is-character-prepared');
    });
    if ('IntersectionObserver' in window) {
      const titleObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-character-revealing');
        titleObserver.unobserve(entry.target);
      }), {threshold: .55});
      sectionTitles.forEach(title => titleObserver.observe(title));
    } else {
      sectionTitles.forEach(title => title.classList.add('is-character-revealing'));
    }
  }
  // Preserve the existing opt-in GA ID mechanism. Legacy application pages initialise it themselves.
  if (typeof window.aidecTrack !== 'function') {
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
      link.addEventListener('click', () => window.aidecTrack('free_diagnosis_click', {link_text: link.textContent.trim(), link_location: link.closest('header') ? 'header' : link.closest('#service') ? 'service' : link.closest('#contact') ? 'contact' : 'other'}));
    });
    document.querySelectorAll('.faq-item').forEach(item => item.addEventListener('toggle', () => {
      if (item.open) window.aidecTrack('faq_open', {question: item.querySelector('summary')?.textContent.trim() || ''});
    }));
  }
})();
