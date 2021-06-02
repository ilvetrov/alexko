const { randomNumber } = require("./random");

function getVariant(req, res, name, variants) {
  const variantNumber = (function() {
    try {
      if (req.cookies?.abt && JSON.parse(req.cookies.abt)[name] !== undefined) {
        return Number(JSON.parse(req.cookies.abt)[name]);
      } else {
        if (!req.cookies?.abt) req.cookies.abt = JSON.stringify({});
  
        const randomNumberOfVariant = randomNumber(0, variants.length - 1);
        const newABList = (function() {
          const ABList = JSON.parse(req.cookies.abt);
          ABList[name] = randomNumberOfVariant;
          return ABList;
        }());
        req.cookies.abt = JSON.stringify(newABList);
        res.cookie('abt', JSON.stringify(newABList), {
          maxAge: 1000 * 60 * 60 * 24 * 365,
          sameSite: true,
        });
  
        return randomNumberOfVariant;
  
      }
    } catch (error) {
      console.error(error);
      return 0;
    }
  }());

  return variants[variantNumber]
}

function getNumberOf(req, name) {
  if (!(req.cookies?.abt && JSON.parse(req.cookies.abt)[name] !== undefined)) return 0;

  return Number(JSON.parse(req.cookies.abt)[name]);
}

module.exports = {
  getVariant,
  getNumberOf
}