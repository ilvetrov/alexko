window.addEventListener('resize-width', function() {
  document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
});