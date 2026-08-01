(() => {
  const intro = document.getElementById('brand-intro');
  if (!intro) return;

  const body = document.body;
  const skipButton = intro.querySelector('.brand-intro-skip');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let finished = false;
  let finishTimer;

  const finish = (skipped = false) => {
    if (finished) return;
    finished = true;
    window.clearTimeout(finishTimer);
    intro.classList.add(skipped ? 'is-skipped' : 'is-complete');
    body.classList.add('brand-intro-revealing');

    window.setTimeout(() => {
      body.classList.remove('brand-intro-pending', 'brand-intro-revealing');
      intro.hidden = true;
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      document.querySelector('.site-header')?.focus({ preventScroll: true });
    }, skipped ? 720 : 1050);
  };

  skipButton?.addEventListener('click', () => finish(true));
  intro.addEventListener('keydown', event => {
    if (event.key === 'Escape') finish(true);
  });

  if (reduceMotion) {
    intro.classList.add('is-reduced-motion');
    finishTimer = window.setTimeout(() => finish(false), 1500);
  } else {
    requestAnimationFrame(() => intro.classList.add('is-playing'));
    finishTimer = window.setTimeout(() => finish(false), 7200);
  }
})();
