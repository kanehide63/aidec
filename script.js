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
  document.querySelectorAll('.service-accordion').forEach(accordion => {
    const button = accordion.querySelector('.service-accordion-button');
    const panel = accordion.querySelector('.service-accordion-panel');
    if (!button || !panel) return;
    button.addEventListener('click', () => {
      const willOpen = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(willOpen));
      panel.setAttribute('aria-hidden', String(!willOpen));
      panel.inert = !willOpen;
      panel.classList.toggle('is-open', willOpen);
      panel.style.maxHeight = willOpen ? `${panel.scrollHeight}px` : '0px';
      if (willOpen) window.aidecTrack('service_details_open', {
        service: panel.id === 'strategy-report-details' ? 'AI企業診断360 戦略レポート' : 'AI360 Webスタータープラン'
      });
    });
    window.addEventListener('resize', () => {
      if (button.getAttribute('aria-expanded') === 'true') panel.style.maxHeight = `${panel.scrollHeight}px`;
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

  const characterRevealItems = document.querySelectorAll('.character-reveal');
  characterRevealItems.forEach(item => {
    if (reduceMotion) return;
    const accessibleText = item.innerText.replace(/\s+/g, ' ').trim();
    const speed = Number(item.dataset.characterSpeed) || 45;
    const textNodes = [];
    const walker = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    let characterIndex = 0;
    textNodes.forEach(node => {
      const fragment = document.createDocumentFragment();
      [...node.textContent].forEach(character => {
        const span = document.createElement('span');
        span.className = 'character-reveal-char';
        span.setAttribute('aria-hidden', 'true');
        span.style.setProperty('--character-delay', `${120 + characterIndex * speed}ms`);
        span.textContent = character;
        fragment.appendChild(span);
        characterIndex += 1;
      });
      node.replaceWith(fragment);
    });
    item.setAttribute('aria-label', accessibleText);
  });
  if (!reduceMotion && characterRevealItems.length && 'IntersectionObserver' in window) {
    const characterObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-character-revealing');
        characterObserver.unobserve(entry.target);
      }
    }), { threshold: .45 });
    characterRevealItems.forEach(item => characterObserver.observe(item));
  } else {
    characterRevealItems.forEach(item => item.classList.add('is-character-revealing'));
  }

  const messageMark = document.querySelector('.message-mark');
  const messageDot = messageMark?.querySelector('.message-symbol-dot');
  const playMessageSymbol = () => {
    if (!messageMark || !messageDot || messageMark.dataset.symbolPlayed === 'true') return;
    messageMark.dataset.symbolPlayed = 'true';
    if (reduceMotion || typeof messageDot.animate !== 'function') {
      messageMark.classList.add('is-symbol-settled');
      return;
    }
    const markRect = messageMark.getBoundingClientRect();
    const dotRect = messageDot.getBoundingClientRect();
    const finalX = dotRect.left - markRect.left + dotRect.width / 2;
    const finalY = dotRect.top - markRect.top + dotRect.height / 2;
    const radius = Math.max(dotRect.width, dotRect.height) / 2;
    const edge = Math.max(18, Math.min(markRect.width, markRect.height) * 0.06);
    const left = edge + radius - finalX;
    const right = markRect.width - edge - radius - finalX;
    const top = edge + radius - finalY;
    const bottom = markRect.height - edge - radius - finalY;
    const keyframes = [
      { transform: `translate(calc(-50% + ${left}px),calc(-50% + ${top + 24}px)) scale(.96)` },
      { transform: `translate(calc(-50% + ${right}px),calc(-50% + ${top + 58}px)) scale(1.02)`, offset: .2 },
      { transform: `translate(calc(-50% + ${right - 52}px),calc(-50% + ${bottom}px)) scale(.98)`, offset: .4 },
      { transform: `translate(calc(-50% + ${left}px),calc(-50% + ${bottom - 48}px)) scale(1.02)`, offset: .6 },
      { transform: `translate(calc(-50% + ${left + 66}px),calc(-50% + ${top}px)) scale(.98)`, offset: .78 },
      { transform: `translate(calc(-50% + ${right * .22}px),calc(-50% + ${bottom * .18}px)) scale(1.01)`, offset: .9 },
      { transform: 'translate(-50%,-50%) scale(1)', offset: 1 }
    ];
    const animation = messageDot.animate(keyframes, {
      duration: 2850,
      easing: 'cubic-bezier(.42,0,.22,1)',
      fill: 'both'
    });
    animation.addEventListener('finish', () => {
      animation.cancel();
      messageMark.classList.add('is-symbol-settled');
    }, { once: true });
  };
  if (messageMark && 'IntersectionObserver' in window) {
    const messageObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        playMessageSymbol();
        messageObserver.disconnect();
      }
    }, { threshold: .42 });
    messageObserver.observe(messageMark);
  } else {
    playMessageSymbol();
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
