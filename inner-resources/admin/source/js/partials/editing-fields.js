const editorProperties = require("./editor-properties");

const fields = document.getElementsByClassName('js-editor-field');

for (let i = 0; i < fields.length; i++) {
  const field = fields[i];

  if (editorProperties.new) {
    field.addEventListener('blur', function() {
      if (field.innerText.trim() === '') {
        field.innerText = '';
      }
    });
  }
}