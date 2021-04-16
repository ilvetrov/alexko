function getElementTransformCoords(element) {
  const searchValues = getComputedStyle(element).transform.match(/matrix\(.*?, .*?, .*?, .*?, (.*?), (.*?)\)$/);
  
  if (!searchValues) return {
    y: 0,
    x: 0
  }

  return {
    x: Number(searchValues[1] || '0'),
    y: Number(searchValues[2] || '0')
  }
}

module.exports = getElementTransformCoords;