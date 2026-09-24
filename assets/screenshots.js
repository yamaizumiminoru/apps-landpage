'use strict';
(() => {
  const dialog = document.getElementById('screenshot-dialog');
  if (!dialog || typeof dialog.showModal !== 'function') return;
  const image = document.getElementById('screenshot-image');
  const title = document.getElementById('screenshot-title');
  const original = document.getElementById('screenshot-original');
  let opener = null;
  document.querySelectorAll('.screenshot-frame').forEach(link => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      title.textContent = link.dataset.screenshotTitle;
      image.src = link.href;
      image.alt = link.querySelector('img').alt;
      original.href = link.href;
      document.documentElement.classList.add('screenshot-open');
      dialog.showModal();
    });
  });
  dialog.querySelector('.screenshot-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const box = dialog.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.classList.remove('screenshot-open');
    if (opener && opener.isConnected) opener.focus({ preventScroll: true });
  });
})();
