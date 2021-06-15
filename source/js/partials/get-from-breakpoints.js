function getFromBreakpoints(breakpoints, isMinWidth = true, windowWidth = window.innerWidth) {
  const widths = Object.keys(breakpoints);
  if (isMinWidth) {
    widths.sort((a, b) => b - a);
  } else {
    widths.sort((a, b) => a - b);
  }
  for (let i = 0; i < widths.length; i++) {
    const width = widths[i];
    if (isMinWidth ? width <= windowWidth : width >= windowWidth) return breakpoints[width];
  }
}

module.exports = getFromBreakpoints;