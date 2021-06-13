const { initStyles } = require("./dynamic-styles-core");

initStyles('js-dys-mobile-gallery-top-offset', '--margin-top', {
  1701: () => undefined,
  1301: (windowWidth) => {
    return `${Math.round(33.6 * 1700 / windowWidth * (1700 / windowWidth))}px`;
  },
  0: () => '58px'
});