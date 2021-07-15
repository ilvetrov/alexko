const getFileContent = require("./get-file-content");

function insertStyle(name, options) {
  return `<style type="text/css">${insertOptions(getFileContent('css/' + name), options)}</style>`;
}

function insertScript(name) {
  return `<script type="text/javascript">${getFileContent('js/' + name)}</script>`;
}

function insertOptions(text, options) {
  let output = text;

  for (const name in options) {
    if (Object.hasOwnProperty.call(options, name)) {
      const value = options[name];
      const regExp = new RegExp(`%%${name}%%`, 'g');
      output = output.replace(regExp, value);
    }
  }

  return output;
}

module.exports = {
  insertStyle,
  insertScript,
  insertOptions
};