document.addEventListener('DOMContentLoaded', () => {

  // CODE FOR MENU AND FOCUS HOLD (Focus Trap)

  const hamburgerBtn = document.querySelector('.nav__hamburger');
  const menuPanel = document.getElementById('menu-panel');
  const menuOverlay = document.getElementById('menu-overlay');
  const toggleImg = hamburgerBtn.querySelector('img');

  const menuIconSrc = './assets/images/icon-menu.svg';
  const closeIconSrc = './assets/images/icon-close.svg';

  // Find all the items inside the menu that can be tabbed to
  const focusableElementsString = 'a[href], button:not([disabled])';
  
  function openMenu() {
    menuPanel.classList.add('is-open');
    menuOverlay.classList.add('is-open'); 
    toggleImg.src = closeIconSrc;
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    
    // Add a listener to hold focus inside the menu
    menuPanel.addEventListener('keydown', trapFocus);
    
    // Convenient: immediately focus the first link in the menu
    const firstFocusableElement = menuPanel.querySelectorAll(focusableElementsString)[0];
    if (firstFocusableElement) firstFocusableElement.focus();
  }

  function closeMenu() {
    menuPanel.classList.remove('is-open');
    menuOverlay.classList.remove('is-open'); 
    toggleImg.src = menuIconSrc;
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    
    // Remove the listener when the menu is closed
    menuPanel.removeEventListener('keydown', trapFocus);
    
    // Return focus to the burger menu button
    hamburgerBtn.focus();
  }

  // Focus Trap (holds Tab inside the menu in a circle)
  function trapFocus(e) {
    if (e.key !== 'Tab') return;

    const focusableElements = menuPanel.querySelectorAll(focusableElementsString);
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) { 
      if (document.activeElement === firstFocusableElement) {
        lastFocusableElement.focus();
        e.preventDefault();
      }
    } else { 
      if (document.activeElement === lastFocusableElement) {
        firstFocusableElement.focus();
        e.preventDefault();
      }
    }
  }

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = menuPanel.classList.contains('is-open');
    if (!isOpen) openMenu(); else closeMenu();
  });

  menuOverlay.addEventListener('click', closeMenu);

  // ANIMATING COUNTERS WITH JSON + PREFERS-REDUCED-MOTION
  
  // Check if the user has enabled the "no animations" mode in the system
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  fetch('./data.json')
    .then(response => response.json())
    .then(data => {
      data.forEach(stat => {
        const cards = document.querySelectorAll('.stat-card');
        
        cards.forEach(card => {
          const labelElement = card.querySelector('.stat-card__label');
          
          if (labelElement && labelElement.textContent.trim() === stat.label) {
            const numberElement = card.querySelector('.stat-card__number');
            if (numberElement) {
              // If animations are turned off, just put the final number right away
              if (prefersReducedMotion) {
                numberElement.innerHTML = stat.isFloat 
                  ? stat.value.toFixed(1) + stat.suffix 
                  : stat.value.toLocaleString('en-US') + stat.suffix;
              } else {
                // If everything is ok — start a smooth run of numbers
                animateValue(numberElement, 0, stat.value, 1500, stat.isFloat, stat.suffix);
              }
            }
          }
        });
      });
    })
    .catch(error => console.error('Помилка при завантаженні JSON:', error));

  function animateValue(obj, start, end, duration, isFloat, suffix) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      let currentCount = progress * (end - start) + start;
      
      if (isFloat) {
        obj.innerHTML = currentCount.toFixed(1) + suffix;
      } else {
        obj.innerHTML = Math.floor(currentCount).toLocaleString('en-US') + suffix;
      }
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }
});
