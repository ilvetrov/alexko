module.exports = (string) => {
  return string.split(`\n`).join('').split('  ').join('');
}