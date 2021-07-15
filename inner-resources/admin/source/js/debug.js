function checkTimeSync(action, amount = 1) {
  const startTime = Date.now();
  for (let i = 0; i < amount; i++) {
    action();
  }
  console.log(`syncTime: ${Date.now() - startTime}ms`);
}

function checkTimeAsync(action, amount = 1) {
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

if (typeof window !== 'undefined') {
  window.checkTimeSync = checkTimeSync;
  window.checkTimeAsync = checkTimeAsync;
}

module.exports = {
  checkTimeSync,
  checkTimeAsync
}