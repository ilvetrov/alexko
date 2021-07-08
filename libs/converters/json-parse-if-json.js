function jsonParseIfJson(jsonOrNot) {
  try {
    return JSON.parse(jsonOrNot);
  } catch (error) {
    return jsonOrNot;
  }
}

module.exports = jsonParseIfJson;