let cacheStorage = {};

const defaultMsToClear = 1000 * 60 * 60 * 24;

function get(cacheName) {
  return cacheStorage[cacheName];
}

function set(cacheName, value, msToClear = defaultMsToClear) {
  cacheStorage[cacheName] = value;

  setTimeout(() => {
    if (cacheStorage[cacheName]) delete cacheStorage[cacheName];
  }, msToClear);
}

function remove(cacheName) {
  delete cacheStorage[cacheName];
}

function getOrSet(cacheName, getValueFunction, msToClear = defaultMsToClear) {
  const cached = get(cacheName);
  if (cached) {

    if (getValueFunction.constructor.name === 'AsyncFunction' || getValueFunction.constructor.name === 'Promise') {
      return new Promise(function(resolve, reject) {
        resolve(cached);
      });
    } else {
      return cached;
    }
    
  } else {

    if (getValueFunction.constructor.name === 'AsyncFunction' || getValueFunction.constructor.name === 'Promise') {
      return new Promise(function(resolve, reject) {
        getValueFunction().then(function(newValue) {
          set(cacheName, newValue, msToClear);
          resolve(newValue);
        });
      });
    } else {
      const newValue = getValueFunction();
      set(cacheName, newValue, msToClear);
      return newValue;
    }

  }
}

setInterval(() => {
  cacheStorage = {};
}, defaultMsToClear);

const cache = {
  getOrSet,
  remove
}

module.exports = cache;