// DYS

const getFromBreakpoints = require("./get-from-breakpoints");

function initStyles(className, varName, breakpoints) {
  const elements = document.getElementsByClassName(className);
  if (elements.length == 0) return;

  const windowWidth = window.innerWidth;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const defaultValue = element.style.getPropertyValue(varName) || getFromBreakpoints(breakpoints, true, windowWidth)(windowWidth);
    updateStyles(element, varName, getFromBreakpoints(breakpoints, true, windowWidth)(windowWidth) || defaultValue);

    let lastWidth = windowWidth;
    window.addEventListener('resize', function() {
      const newWindowWidth = window.innerWidth;
      if (lastWidth === newWindowWidth) return;
      lastWidth = newWindowWidth;
  
      updateStyles(element, varName, getFromBreakpoints(breakpoints, true, newWindowWidth)(newWindowWidth) || defaultValue);
    });
  }

}

function updateStyles(element, varName, value) {
  if (!value) return;
  element.style.setProperty(varName, value);
}

const dys = {
  initStyles
}

module.exports = dys;