const hbs = require('hbs');

hbs.registerHelper('iif', (condition, ifTrue, ifFalse) => {
  if (condition) {
    return ifTrue;
  } else {
    return ifFalse;
  }
});