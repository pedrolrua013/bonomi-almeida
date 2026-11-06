(function () {
  'use strict';

  /* Nav scroll */
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('scrolled', window.scrollY > 72);
  }, { passive: true });

  /* Mobile burger */
  var burger = document.getElementById('burger');
  var mobileNav = document.getElementById('mobile-nav');
  var menuOpen = false;

  function toggleMenu(open) {
    menuOpen = open;
    mobileNav.hidden = !open;
    burger.setAttribute('aria-expanded', open);
    var spans = burger.querySelectorAll('span');
    if (open) {
      spans[0].style.cssText = 'transform:translateY(6px) rotate(45deg)';
      spans[1].style.cssText = 'opacity:0';
      spans[2].style.cssText = 'transform:translateY(-6px) rotate(-45deg)';
    } else {
      spans.forEach(function (s) { s.style.cssText = ''; });
    }
  }

  burger.addEventListener('click', function () { toggleMenu(!menuOpen); });
  mobileNav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { toggleMenu(false); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menuOpen) toggleMenu(false);
  });

  /* Scroll reveal */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.r').forEach(function (el) { io.observe(el); });

  /* FAQ accordion */
  document.querySelectorAll('.faq-q').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var answer = item.querySelector('.faq-a');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-a').style.maxHeight = '0';
        openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* Form */
  var cform = document.getElementById('cform');
  if (cform) cform.addEventListener('submit', function (e) {
    e.preventDefault();
    var msg = document.getElementById('form-msg');
    msg.style.color = 'rgba(245,241,235,.68)';
    msg.textContent = 'Mensagem enviada. Entraremos em contato em breve para verificar as possibilidades de atendimento.';
    this.reset();
  });
})();
