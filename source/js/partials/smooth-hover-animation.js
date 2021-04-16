function smoothHoverAnimation(elementClass, animationClass){
  
  const elements = document.getElementsByClassName(elementClass);
  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];

    function onMouseOver(){
      element.classList.add(animationClass);
    }
    
    function onAnimationEnd(){
      element.classList.remove(animationClass);
    }

    element.addEventListener('mouseenter', onMouseOver, false);
    element.addEventListener('touchstart', onMouseOver, false);

    element.addEventListener('webkitAnimationIteration', onAnimationEnd, false);
    element.addEventListener('animationiteration', onAnimationEnd, false);
    element.addEventListener('animationend', onAnimationEnd, false);
  }
}

module.exports = smoothHoverAnimation;