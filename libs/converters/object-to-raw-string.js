const removeWhitespaces = require("../remove-whitespaces");
const jsonParseIfJson = require("./json-parse-if-json");

function objectToRawString(object) {
  let prepared = {};
  
  for (const key in object) {
    if (Object.hasOwnProperty.call(object, key)) {
      const element = object[key];

      if (element?.constructor?.name === 'Object') {
        prepared[key] = objectToRawString(element);
        continue;
      }

      if (!!(element?.constructor?.name?.match(/function/i))) {
        prepared[key] = "/Function(" + element.toString() + ")/";;
        continue;
      }

      prepared[key] = element;
    }
  }

  return removeWhitespaces(JSON.stringify(prepared));
}

function rawStringToObject(rawStringOrObject) {
  const deconstructedObject = jsonParseIfJson(rawStringOrObject);

  if (deconstructedObject.constructor.name !== 'Object') return deconstructedObject;

  let deconstructed = {};

  for (const key in deconstructedObject) {
    if (Object.hasOwnProperty.call(deconstructedObject, key)) {
      const rawElement = jsonParseIfJson(deconstructedObject[key]);

      if (rawElement.constructor.name === 'Object') {
        deconstructed[key] = rawStringToObject(rawElement);
        continue;
      }

      if (typeof rawElement === "string" && rawElement.startsWith("/Function(") && rawElement.endsWith(")/")) {
        deconstructed[key] = (0, eval)("(" + rawElement.substring(10, rawElement.length - 2) + ")");
        continue;
      }

      deconstructed[key] = rawElement;
    }
  }

  return deconstructed;
}

module.exports = {
  objectToRawString,
  rawStringToObject
}