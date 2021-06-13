window.checkTimeSync = function (action, amount = 1) {
  const startTime = Date.now();
  for (let i = 0; i < amount; i++) {
    action();
  }
  console.log(`syncTime: ${Date.now() - startTime}ms`);
}

window.checkTimeAsync = function (action, amount = 1) {
  if (amount === 1) {
    var startTime = Date.now();
    action(sendEndTime);
  } else {
    const actions = [];
    for (let i = 0; i < amount; i++) {
      actions.push(action);
    }
    var startTime = Date.now();
    Promise.all(actions).then(sendEndTime);
  }
  function sendEndTime() {
    console.log(`asyncTime: ${Date.now() - startTime}ms`);
  }
}