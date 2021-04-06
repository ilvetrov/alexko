function paramsToQuery(data = {}) {
  const output = [];
  for (let value in data)
    output.push(encodeURIComponent(value) + '=' + encodeURIComponent(data[value]));
  return '?' + output.join('&');
}

module.exports = {
  paramsToQuery
}