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

/* Linha do tempo (etapas do atendimento) */
(function () {
  'use strict';
  document.querySelectorAll('.timeline').forEach(function (tl) {
    var steps = Array.prototype.slice.call(tl.querySelectorAll('.tl-step'));
    if (!steps.length) return;
    var current = -1;

    function center(el) {
      var r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    function vertical() { return window.matchMedia('(max-width: 960px)').matches; }

    function render() {
      var first = center(steps[0].querySelector('.tl-dot'));
      var last = center(steps[steps.length - 1].querySelector('.tl-dot'));
      if (vertical()) tl.style.setProperty('--track', (last.y - first.y) + 'px');
      else tl.style.removeProperty('--track');
      steps.forEach(function (s, i) {
        s.classList.toggle('is-done', i <= current);
        s.classList.toggle('is-current', i === current);
      });
      if (current < 0) { tl.style.setProperty('--fill', '0px'); return; }
      var a = center(steps[0].querySelector('.tl-dot'));
      var b = center(steps[current].querySelector('.tl-dot'));
      var len = vertical() ? b.y - a.y : b.x - a.x;
      tl.style.setProperty('--fill', Math.max(0, len) + 'px');
    }
    function go(i) { if (i !== current) { current = i; render(); } }

    steps.forEach(function (s, i) {
      s.addEventListener('mouseenter', function () { go(i); });
      s.addEventListener('focus', function () { go(i); });
      s.addEventListener('click', function () { go(i); });
    });
    window.addEventListener('resize', render, { passive: true });
    render();

    /* Telas sem hover: a linha avança conforme a rolagem */
    if (window.matchMedia('(hover: none)').matches && 'IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            var i = steps.indexOf(e.target);
            if (i > current) go(i);
          }
        });
      }, { rootMargin: '0px 0px -45% 0px' });
      steps.forEach(function (s) { io.observe(s); });
    }
  });
})();
