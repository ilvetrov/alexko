function smoothScrollTo(selector, offset = 0, mobileOffset = offset) {
  try {
    let elementY;
    if (window.innerWidth > 380) {
      elementY = document.querySelector(selector).getBoundingClientRect().y + window.pageYOffset - offset;
    } else {
      elementY = document.querySelector(selector).getBoundingClientRect().y + window.pageYOffset - mobileOffset;
    }
    window.scrollTo({top: elementY, behavior: 'smooth'});
    return false;
  } catch (error) {
    return true;
  }
}

function smoothScrollToElement(element, offset = 0, mobileOffset = offset) {
  try {
    let elementY;
    if (window.innerWidth > 380) {
      elementY = element.getBoundingClientRect().y + window.pageYOffset - offset;
    } else {
      elementY = element.getBoundingClientRect().y + window.pageYOffset - mobileOffset;
    }
    window.scrollTo({top: elementY, behavior: 'smooth'});
    return false;
  } catch (error) {
    return true;
  }
}

module.exports = {
  smoothScrollTo,
  smoothScrollToElement
}