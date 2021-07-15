function removeHtmlComments(string) {
  return string.replace(/<!--[\s\S]*?-->/g, '');
}

module.exports = removeHtmlComments;