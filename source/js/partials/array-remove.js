function arrayRemove(array, value) { 
  return array.filter(element => element !== value);
}

module.exports = arrayRemove;