function getEditorImages(editorData) {
  if (!editorData?.blocks) return [];

  const images = [];
  
  for (let i = 0; i < editorData.blocks.length; i++) {
    const block = editorData.blocks[i];
    if (block.type == 'image') {
      images.push(block.data.file.name);
    }
  }

  return images;
}

function getEditorImagesFromMultilingual(editorsData) {
  if (typeof editorsData !== 'object') return [];

  let images = [];

  for (const langCodeName in editorsData) {
    if (Object.hasOwnProperty.call(editorsData, langCodeName)) {
      const editorData = editorsData[langCodeName];
      images = [...images, ...getEditorImages(editorData)];
    }
  }

  return images;
}

module.exports = {
  getEditorImages,
  getEditorImagesFromMultilingual
};