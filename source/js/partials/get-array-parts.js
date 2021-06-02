function getAllBefore(array, current) {
  const i = array.indexOf(current);
  return i > -1 ? array.slice(0, i) : [];
}
function getAllAfter(array, current) {
  const i = array.indexOf(current);
  return i > -1 ? array.slice(i + 1, array.length) : [];
}

module.exports = {
  getAllBefore,
  getAllAfter
}