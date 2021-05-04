const defaultProperties = {
  
};

let elementWithProperties, pageProperties;

try {
  elementWithProperties = document.querySelector('[data-editor-properties]');
  pageProperties = JSON.parse(elementWithProperties.getAttribute('data-editor-properties'));
} catch (error) {
  pageProperties = {};
}

const editorProperties = {...defaultProperties, ...pageProperties};

module.exports = editorProperties;