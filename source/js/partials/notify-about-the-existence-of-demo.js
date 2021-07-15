const { showPopUp } = require("./pop-up");

function notifyAboutTheExistenceOfDemo() {
  showPopUp('demo-exists');
  return false;
}

window.notifyAboutTheExistenceOfDemo = notifyAboutTheExistenceOfDemo;