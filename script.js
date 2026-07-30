(() => {
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
  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 8);
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
