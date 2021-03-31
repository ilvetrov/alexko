function checkThatElementIsNear(element, topOffset = 200, bottomOffset = topOffset) {
  return (element.getBoundingClientRect().y - topOffset <= window.innerHeight && element.getBoundingClientRect().y + bottomOffset + element.offsetHeight > 0) || false;
}
function checkElementVisibilityForInteractions(element, offset = 0) {
  let bottomScreenY = window.pageYOffset + window.innerHeight,
      yElementPositionRelativeToTheScreen = window.pageYOffset + element.getBoundingClientRect().y;
  return (yElementPositionRelativeToTheScreen < bottomScreenY) && element.getBoundingClientRect().y > offset;
}
function checkElementIsOnScreenCenter(element) {
  let bottomScreenY = window.pageYOffset + (window.innerHeight / 2),
      yElementPositionRelativeToTheScreen = window.pageYOffset + element.getBoundingClientRect().y;
  return (yElementPositionRelativeToTheScreen < bottomScreenY);
}

module.exports = {
  checkThatElementIsNear,
  checkElementVisibilityForInteractions,
  checkElementIsOnScreenCenter
}