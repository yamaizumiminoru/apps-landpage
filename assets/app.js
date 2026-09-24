/* Progressive enhancement. The entire product introduction works without JS. */
(() => {
  'use strict';
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#site-nav');
  const mobile = window.matchMedia('(max-width: 700px)');
  if (menu && nav) {
    function closeMenu(returnFocus = false) {
      nav.classList.remove('is-open');
      menu.setAttribute('aria-expanded', 'false');
      menu.querySelector('span').textContent = '＋';
      if (returnFocus) menu.focus();
    }
    menu.addEventListener('click', () => {
      const opening = menu.getAttribute('aria-expanded') !== 'true';
      nav.classList.toggle('is-open', opening);
      menu.setAttribute('aria-expanded', String(opening));
      menu.querySelector('span').textContent = opening ? '−' : '＋';
    });
    nav.addEventListener('click', event => {
      const link = event.target.closest('a[href^="#"]');
      if (!link) return;
      closeMenu();
      // Keep keyboard focus on the destination, not a newly hidden mobile link.
      if (mobile.matches) {
        const target = document.getElementById(link.getAttribute('href').slice(1));
        if (target) {
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
      }
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') closeMenu(true);
    });
    document.addEventListener('click', event => {
      if (menu.getAttribute('aria-expanded') === 'true' && !event.target.closest('.site-header')) closeMenu();
    });
    const syncNavigation = () => {
      // JS cannot leave a desktop-only menu toggle visible and focusable.
      menu.hidden = !mobile.matches;
      closeMenu();
    };
    document.documentElement.classList.add('js-ready');
    syncNavigation();
    if (mobile.addEventListener) mobile.addEventListener('change', syncNavigation);
    else mobile.addListener(syncNavigation);
  }

  const answers = document.querySelector('.demo-answers');
  const feedback = document.querySelector('#demo-feedback');
  const message = document.querySelector('#demo-message');
  const blank = document.querySelector('#demo-blank');
  const reset = document.querySelector('.demo-reset');
  if (answers && feedback && message && blank && reset) {
    const buttons = [...answers.querySelectorAll('[data-answer]')];
    const initial = '知っている表現を、とっさに選べる形へ。';
    answers.hidden = false;
    answers.addEventListener('click', event => {
      const button = event.target.closest('[data-answer]');
      if (!button || !answers.contains(button)) return;
      const correct = button.dataset.answer === 'taking';
      buttons.forEach(item => {
        item.setAttribute('aria-pressed', String(item === button));
        item.classList.toggle('is-correct', correct && item === button);
      });
      blank.textContent = correct ? 'taking' : '_____';
      feedback.dataset.state = correct ? 'correct' : 'retry';
      message.textContent = correct
        ? 'そう、taking。この形では suggest の後ろに -ing 形を続けます。次は、文全体を声に出してみましょう。'
        : '意味は伝わりそう。でも、この形では suggest の後ろは -ing 形。taking を選んでみましょう。';
      reset.hidden = false;
    });
    reset.addEventListener('click', () => {
      buttons.forEach(button => {
        button.setAttribute('aria-pressed', 'false');
        button.classList.remove('is-correct');
      });
      blank.textContent = '_____';
      delete feedback.dataset.state;
      message.textContent = initial;
      reset.hidden = true;
      buttons[0].focus();
    });
  }

  const finder = document.querySelector('.lab-finder');
  const guide = globalThis.LAB_GUIDE;
  if (finder && guide) {
    function showRecommendation(value) {
      if (!Object.prototype.hasOwnProperty.call(guide, value)) return;
      const selected = guide[value];
      const result = finder.querySelector('.finder-result');
      result.dataset.result = value;
      document.querySelector('#result-intro').textContent = selected.intro;
      document.querySelector('#result-title').textContent = selected.name;
      document.querySelector('#result-description').textContent = selected.description;
      const link = document.querySelector('#result-link');
      link.setAttribute('href', `#${selected.id}`);
      // Editorial content only, assigned as text rather than HTML.
      link.replaceChildren(document.createTextNode(`${selected.name}を見る `));
      const arrow = document.createElement('span');
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '↗';
      link.append(arrow);
    }
    finder.querySelector('form').addEventListener('submit', event => event.preventDefault());
    finder.addEventListener('change', event => {
      if (event.target.matches('input[name="goal"]')) showRecommendation(event.target.value);
    });
    showRecommendation(finder.querySelector('input[name="goal"]:checked').value);
    finder.hidden = false;
  }
})();
