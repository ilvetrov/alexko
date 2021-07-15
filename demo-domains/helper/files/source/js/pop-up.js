try {
  const { showPopUp, checkPopUp, addCallbackToHideOfPopUp } = require("../../../../../source/js/partials/pop-up");
  const cookies = require("../../../../../source/js/partials/cookies");
  
  if (!cookies.get('demo_pop_up_shown')) {
    setTimeout(() => {
      if (checkPopUp('alexko-demo')) {
        showPopUp('alexko-demo');
        addCallbackToHideOfPopUp('alexko-demo', function() {
          cookies.set('demo_pop_up_shown', true, 1);
        });
      }
    }, 0);
  }

  window.showDemoErrorPopUp = () => showPopUp('alexko-demo-error');
} catch (error) {
  console.error(error);
}