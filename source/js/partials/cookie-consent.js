const { showActionCloud } = require("./action-cloud");

window.addEventListener('load', function() {
  setTimeout(() => {
    showActionCloud('cookie-consent');
  }, 200);
});