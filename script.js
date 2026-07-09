/* ==========================================================
 AI360ラボ - script.js
 Phase3：必要最小限のUX
========================================================== */

// 年号
const year = new Date().getFullYear();
const footer = document.querySelector(".site-footer p");
if (footer) {
  footer.textContent = `© ${year} AI360ラボ`;
}

// ヘッダー影
const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  if (!header) return;
  header.style.boxShadow =
    window.scrollY > 10
      ? "0 8px 24px rgba(11,35,65,.10)"
      : "none";
});

// フェードイン
const targets = document.querySelectorAll(".section, .hero");
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.animate(
        [{opacity:0, transform:"translateY(20px)"},
         {opacity:1, transform:"translateY(0)"}],
        {duration:600, easing:"ease-out", fill:"forwards"}
      );
      io.unobserve(e.target);
    }
  });
},{threshold:.15});

targets.forEach(el=>{
  el.style.opacity="0";
  io.observe(el);
});

// お問い合わせボタン
document.querySelectorAll('a[href^="mailto:"]').forEach(btn=>{
  btn.addEventListener("click", ()=>{
    console.log("Contact button clicked");
  });
});
