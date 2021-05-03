function insertAfter(newNode, existingNode) {
  if (existingNode.nextSibling) {
    return existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
  } else {
    return existingNode.parentNode.appendChild(newNode);
  }
}

module.exports = insertAfter;