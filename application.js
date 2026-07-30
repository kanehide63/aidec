(() => {
  const form = document.getElementById('diagnosis-form');
  if (!form) return;
  const panels = [...document.querySelectorAll('[data-step]')];
  const progressItems = [...document.querySelectorAll('[data-progress]')];
  const confirmationList = document.getElementById('confirmation-list');
  const toConfirm = document.getElementById('to-confirm');
  const backToInput = document.getElementById('back-to-input');
  const submitButton = document.getElementById('submit-application');
  const submitError = document.getElementById('submit-error');
  const fields = [...form.querySelectorAll('input:not([type="checkbox"]):not([type="hidden"]), textarea')];
  const consent = document.getElementById('privacy-consent');
  const labels = {
    company: '会社名・屋号', name: 'ご担当者名', email: 'メールアドレス',
    phone: '電話番号', website: 'ホームページURL',
    'google-profile': 'GoogleビジネスプロフィールURL', message: 'ご相談内容',
    'privacy-consent': '個人情報の取り扱い'
  };

  const showStep = step => {
    panels.forEach(panel => { panel.hidden = panel.dataset.step !== step; });
    const order = ['input', 'confirm', 'complete'];
    progressItems.forEach(item => {
      const currentIndex = order.indexOf(step);
      const itemIndex = order.indexOf(item.dataset.progress);
      item.classList.toggle('is-active', itemIndex === currentIndex);
      item.classList.toggle('is-complete', itemIndex < currentIndex);
      if (itemIndex === currentIndex) item.setAttribute('aria-current', 'step');
      else item.removeAttribute('aria-current');
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const clearErrors = () => {
    form.querySelectorAll('.field-error').forEach(error => { error.textContent = ''; });
    form.querySelectorAll('[aria-invalid="true"]').forEach(field => field.removeAttribute('aria-invalid'));
  };
  const setError = (field, message) => {
    const error = document.getElementById(`${field.id}-error`);
    if (error) error.textContent = message;
    field.setAttribute('aria-invalid', 'true');
  };
  const validate = () => {
    clearErrors();
    let valid = true;
    fields.filter(field => field.required).forEach(field => {
      if (!field.value.trim()) {
        setError(field, `${labels[field.id]}を入力してください。`); valid = false;
      } else if (!field.validity.valid) {
        setError(field, field.type === 'email' ? '正しいメールアドレスを入力してください。' : '「https://」から始まる正しいURLを入力してください。');
        valid = false;
      }
    });
    const googleProfile = document.getElementById('google-profile');
    if (googleProfile.value.trim() && !googleProfile.validity.valid) {
      setError(googleProfile, '「https://」から始まる正しいURLを入力してください。'); valid = false;
    }
    if (!consent.checked) { setError(consent, 'プライバシーポリシーへの同意が必要です。'); valid = false; }
    if (!valid) form.querySelector('[aria-invalid="true"]')?.focus();
    return valid;
  };
  const buildConfirmation = () => {
    const items = fields.map(field => ({ label: labels[field.id], value: field.value.trim() || '未入力' }));
    items.push({ label: labels['privacy-consent'], value: '同意する' });
    confirmationList.innerHTML = '';
    items.forEach(item => {
      const wrapper = document.createElement('div');
      const term = document.createElement('dt');
      const detail = document.createElement('dd');
      term.textContent = item.label; detail.textContent = item.value;
      wrapper.append(term, detail); confirmationList.append(wrapper);
    });
  };

  toConfirm.addEventListener('click', () => {
    if (!validate()) return;
    buildConfirmation(); showStep('confirm');
    window.aidecTrack?.('application_confirm_view');
  });
  backToInput.addEventListener('click', () => showStep('input'));
  form.addEventListener('submit', () => {
    window.aidecTrack?.('application_submit_attempt');
    submitError.textContent = '';
    submitButton.disabled = true;
    submitButton.textContent = '送信しています…';
  });
})();
