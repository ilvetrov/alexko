function checkPage(pageName) {
  return document.getElementsByClassName(`js-${pageName}-page`).length > 0;
}

module.exports = checkPage;