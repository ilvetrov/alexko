const { getQueryParameter } = require("../../../../../source/js/partials/get-query-parameter");

function deleteAllCookies() {
  let cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i];
    let eqPos = cookie.indexOf("=");
    let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}

if (getQueryParameter('remove-cookies')) {
  deleteAllCookies();
  const reDeletionUrl = new URL(window.location.href);
  if (!reDeletionUrl.searchParams.has('stop-refresh')) {
    reDeletionUrl.searchParams.append('stop-refresh', 'true');
  } else {
    reDeletionUrl.searchParams.delete('remove-cookies');
    reDeletionUrl.searchParams.delete('stop-refresh');
  }
  window.location.href = reDeletionUrl;
}