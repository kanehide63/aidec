(() => {
  const form = document.querySelector('#contact-form');
  if (!form) return;
  const input = document.querySelector('#contact-input');
  const review = document.querySelector('#contact-review');
  const error = document.querySelector('#contact-error');
  const send = document.querySelector('#contact-send');
  let confirmed = false, sending = false;
  const labels = {'contact-type':'お問い合わせ種別','contact-company':'会社名・屋号','contact-name':'お名前','contact-email':'メールアドレス','contact-phone':'電話番号','contact-message':'お問い合わせ内容'};
  const type = {ai360:'AI企業診断360について',web:'Web制作について',support:'継続支援について',operations:'業務改善・システム導入支援について',googleweb:'Google・Web情報整備支援について',aibusiness:'AI導入・業務活用支援について',referral:'ご紹介特典について',other:'その他'}[new URLSearchParams(location.search).get('type')];
  if (type) document.querySelector('#contact-type').value = type;
  const validate = () => {
    error.textContent = '';
    for (const element of input.querySelectorAll('input, select, textarea')) {
      element.setCustomValidity('');
      if (element.required && element.type !== 'checkbox' && !element.value.trim()) element.setCustomValidity('必須項目を入力してください。');
      if (!element.checkValidity()) {
        error.textContent = '入力内容とプライバシーポリシーへの同意をご確認ください。';
        element.reportValidity(); element.focus(); return false;
      }
    }
    return true;
  };
  document.querySelector('#contact-confirm').addEventListener('click', () => {
    if (!validate()) return;
    const list = document.querySelector('#contact-values'); list.replaceChildren();
    Object.entries(labels).forEach(([id, label]) => {
      const term = document.createElement('dt'), description = document.createElement('dd');
      term.textContent = label; description.textContent = document.getElementById(id).value || '入力なし';
      list.append(term, description);
    });
    confirmed = true; input.hidden = true; review.hidden = false;
    document.querySelector('#review-title').focus();
  });
  document.querySelector('#contact-back').addEventListener('click', () => {
    if (sending) return;
    confirmed = false; review.hidden = true; input.hidden = false;
    document.querySelector('#contact-confirm').focus();
  });
  form.addEventListener('submit', event => {
    if (!confirmed || sending) { event.preventDefault(); return; }
    // Validation was completed before the confirmation panel; no AJAX success is fabricated.
    sending = true; send.disabled = true; document.querySelector('#contact-back').disabled = true;
    send.textContent = '送信中…';
    document.querySelector('#contact-status').textContent = '送信先へ移動しています。通信が完了しない場合は、このページを再読み込みして確認してください。';
  });
  window.addEventListener('pageshow', event => {
    if (!event.persisted) return;
    sending = false; send.disabled = false; document.querySelector('#contact-back').disabled = false;
    send.textContent = 'この内容で送信する'; document.querySelector('#contact-status').textContent = '';
  });
})();
