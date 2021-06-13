// DYS

function initStyles(className, varName, breakpoints) {
  const elements = document.getElementsByClassName(className);
  if (elements.length == 0) return;

  const windowWidth = window.innerWidth;

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    const defaultValue = element.style.getPropertyValue(varName) || detectValue(breakpoints, windowWidth);
    updateStyles(element, varName, detectValue(breakpoints, windowWidth) || defaultValue);

    let lastWidth = windowWidth;
    window.addEventListener('resize', function() {
      const newWindowWidth = window.innerWidth;
      if (lastWidth === newWindowWidth) return;
      lastWidth = newWindowWidth;
  
      updateStyles(element, varName, detectValue(breakpoints, newWindowWidth) || defaultValue);
    });
  }

}

function detectValue(breakpoints, windowWidth) {
  const maxWidths = Object.keys(breakpoints);
  maxWidths.sort((a, b) => b - a);
  for (let i = 0; i < maxWidths.length; i++) {
    const maxWidth = maxWidths[i];
    if (maxWidth <= windowWidth) return breakpoints[maxWidth](windowWidth);
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