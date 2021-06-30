let lastWindowWidth = window.innerWidth;
window.addEventListener('resize', function() {
  if (lastWindowWidth === window.innerWidth) return;

  document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
});