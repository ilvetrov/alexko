function getRandomHash(length = 30) {
  const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const charactersLength = characters.length;
  let outputString = '';
  for (let i = 0; i < length; i++) {
    outputString = outputString + characters[randomNumber(0, charactersLength - 1)]
  }
  return outputString;
}

function randomNumber(min, max) {
  return Math.round(min + Math.random() * max);
}

module.exports = {
  getRandomHash, 
  randomNumber
}