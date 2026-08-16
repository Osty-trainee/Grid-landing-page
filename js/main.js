document.addEventListener('DOMContentLoaded', () => {
  const hamburgerBtn = document.querySelector('.nav__hamburger');
  const menuPanel = document.getElementById('menu-panel');
  const menuOverlay = document.getElementById('menu-overlay');
  const toggleImg = hamburgerBtn.querySelector('img');

  const menuIconSrc = './assets/images/icon-menu.svg';
  const closeIconSrc = './assets/images/icon-close.svg';

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = menuPanel.classList.contains('is-open');

    if (!isOpen) {
      menuPanel.classList.add('is-open');
      menuOverlay.classList.add('is-open'); 
      toggleImg.src = closeIconSrc;
      hamburgerBtn.setAttribute('aria-expanded', 'true');
    } else {
      menuPanel.classList.remove('is-open');
      menuOverlay.classList.remove('is-open'); 
      toggleImg.src = menuIconSrc;
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    }
  });

  menuOverlay.addEventListener('click', () => {
    menuPanel.classList.remove('is-open');
    menuOverlay.classList.remove('is-open');
    toggleImg.src = menuIconSrc;
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  });
});
