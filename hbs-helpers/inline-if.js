const hbs = require('hbs');

hbs.registerHelper('iif', (condition, ifTrue, ifFalse) => {
  if (condition) {
    return ifTrue;
  } else {
    return ifFalse;
  }
});

hbs.registerHelper('iifEquals', (value1, value2, ifTrue, ifFalse) => {
  if (value1 === value2) {
    return ifTrue;
  } else {
    return ifFalse;
  }
});

hbs.registerHelper('iifLess', (value1, value2, ifTrue, ifFalse) => {
  if (value1 < value2) {
    return ifTrue;
  } else {
    return ifFalse;
  }
});

hbs.registerHelper('iifLessOrEquals', (value1, value2, ifTrue, ifFalse) => {
  if (value1 <= value2) {
    return ifTrue;
  } else {
    return ifFalse;
  }
});

hbs.registerHelper('iifBigger', (value1, value2, ifTrue, ifFalse) => {
  if (value1 > value2) {
    return ifTrue;
  } else {
    return ifFalse;
  }
});

hbs.registerHelper('iifInArray', (array, index, ifTrue, ifFalse) => {
  if (array[index]) {
    return ifTrue;
  } else {
    return ifFalse;
  }
});