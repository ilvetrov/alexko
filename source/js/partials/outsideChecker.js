function checkThatCurrentElementExistsOutside(objectOutsideWhichWeAreChecking, currentElement) {
  let currentElementExistsInObjectOutsideWhichWeAreChecking,
      childElementsOfObjectOutsideWhichWeAreChecking = Array.from(objectOutsideWhichWeAreChecking.getElementsByTagName('*')),
      childElementsOfObjectOutsideWhichWeAreCheckingLength = childElementsOfObjectOutsideWhichWeAreChecking.length;
  for (let i = 0; i < childElementsOfObjectOutsideWhichWeAreCheckingLength; i++) {
    const element = childElementsOfObjectOutsideWhichWeAreChecking[i];
    if (element == currentElement) {
      currentElementExistsInObjectOutsideWhichWeAreChecking = true;
      break;
    } else {
      currentElementExistsInObjectOutsideWhichWeAreChecking = false;
    }
  }
  if (
    objectOutsideWhichWeAreChecking != currentElement &&
    !currentElementExistsInObjectOutsideWhichWeAreChecking
  ) {
    return true;
  } else {
    return false;
  }
}

module.exports = checkThatCurrentElementExistsOutside;