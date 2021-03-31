let cacheStorage = {};

function get(cacheName) {
  return cacheStorage[cacheName];
}

function set(cacheName, value) {
  cacheStorage[cacheName] = value;
}

function remove(cacheName) {
  delete cacheStorage[cacheName];
}

function getOrSet(cacheName, getValueFunction) {
  const cached = get(cacheName);
  if (cached) {
    return cached;
  } else {
    const newValue = getValueFunction();
    set(cacheName, newValue);
    return newValue;
  }
}

setInterval(() => {
  cacheStorage = {};
}, 1000 * 60 * 60 * 24);

module.exports = {
  getOrSet,
  remove
}