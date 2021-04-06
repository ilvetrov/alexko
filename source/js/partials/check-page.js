module.exports = (pageName) => {
  return document.getElementsByClassName(`js-${pageName}-page`).length > 0;
}