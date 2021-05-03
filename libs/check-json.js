function checkJson(string) {
  try {
    JSON.parse(string);
  } catch (error) {
    return false;
  }
  return true;
}

module.exports = checkJson;