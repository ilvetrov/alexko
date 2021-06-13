const { disableScrollAnimations } = require("./animations/_disable");

if (document.body.classList.contains('desktop-view')) {
  const handler = function() {
    if (checkMobile()) {
      window.removeEventListener('resize', handler);
      document.body.classList.add('mobile-view');
      document.body.classList.remove('desktop-view');

      disableScrollAnimations();
    }
  }
  window.addEventListener('resize', handler);
}