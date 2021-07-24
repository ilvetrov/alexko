const cookiesNames = require("../../../../libs/cookies-names");
const { addCallbackToHideOfActionCloud, addCallbackToActionOfActionCloud } = require("../action-cloud");
const cookies = require("../cookies");

addCallbackToHideOfActionCloud('cookie-consent', function(actionCloud, closeButton) {
  const isAgree = closeButton && closeButton.hasAttribute('data-action-cloud-make-action');
  cookies.set(cookiesNames.cookiesConsentPopUpWasShown, true, isAgree ? 8760 : 24);
});

addCallbackToActionOfActionCloud('cookie-consent', function() {
  cookies.set(cookiesNames.consentToTheUseOfCookiesReceived, true, 8760);

  const metricsCodeOutput = document.getElementsByClassName('js-metrics-manual-code')[0];

  // Yandex
  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)}; m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window, document, "script", "https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js", "ym"); ym(83065540, "init", { clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true });

  // Google
  metricsCodeOutput.innerHTML = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-SLBV3HP0DY"></script>`;
  (function() {
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    
    gtag('config', 'G-SLBV3HP0DY');
  }());
});