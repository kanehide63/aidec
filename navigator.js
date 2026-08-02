(() => {
  "use strict";

  const form = document.getElementById("navigator-login-form");
  const idInput = document.getElementById("navigator-id");
  const passwordInput = document.getElementById("navigator-password");
  const message = document.getElementById("navigator-login-message");
  const config = window.AIDEC_NAVIGATOR_CONFIG || {};
  const intro = document.getElementById("navigator-brand-intro");

  if (intro) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finishIntro = () => {
      intro.hidden = true;
      document.body.classList.remove("navigator-intro-pending");
    };
    window.setTimeout(finishIntro, reduceMotion ? 0 : 8050);
  }

  if (!form || !idInput || !passwordInput || !message) return;

  const showMessage = (text, isError = false) => {
    message.textContent = text;
    message.classList.toggle("is-error", isError);
    message.hidden = false;
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!idInput.value.trim() || !passwordInput.value) {
      showMessage(config.validationMessage || "IDとPasswordを入力してください。", true);
      (!idInput.value.trim() ? idInput : passwordInput).focus();
      return;
    }

    showMessage(config.preparationMessage || "AIDEC Navigatorは現在準備中です。");
  });
})();
