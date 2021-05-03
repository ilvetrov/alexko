const { addCallbackToUploaded, initUploadInput } = require("./upload-files");

const editorIntroImages = document.getElementsByClassName('js-editor-intro-images')[0];
const editorIntroDesktopImages = document.getElementsByClassName('js-editor-intro-desktop-images')[0];

if (editorIntroImages) {
  addCallbackToUploaded('intro_images', true, addNewPreviewConstructor('intro_images', editorIntroImages));
  addCallbackToUploaded('intro_desktop_images', true, addNewPreviewConstructor('intro_desktop_images', editorIntroDesktopImages));
  
  function addNewPreviewConstructor(idPrefix, container) {
    return function(preview, uploadedFile) {
      const previews = document.querySelectorAll(`[data-group-file-previews="${idPrefix}"]`);
      let amountOfPreviews = previews.length;
      let amountOfUploadedPreviews = 0;
      for (let i = 0; i < previews.length; i++) {
        const previewFromList = previews[i];
        if (previewFromList.classList.contains('uploaded')) {
          amountOfUploadedPreviews++;
        }
        if (previewFromList.classList.contains('js-sample')) {
          amountOfPreviews--;
        }
      }
    
      if (amountOfUploadedPreviews >= amountOfPreviews) {
        const sample = Array.from(previews).find((element) => {
          return element.classList.contains('js-sample');
        });
        if (sample) {
          const newPreview = sample.cloneNode(true);
          const newPreviewId = idPrefix + '_' + previews.length;
          const newInput = newPreview.getElementsByTagName('input')[0];
          const newLabel = newPreview.getElementsByTagName('label')[0];
    
          newPreview.setAttribute('data-upload-file-preview', newPreviewId);
          newInput.setAttribute('id', newPreviewId);
          newLabel.setAttribute('for', newPreviewId);
    
          container.appendChild(newPreview);
    
          sample.classList.remove('disabled', 'js-sample');
    
          const sampleInput = sample.getElementsByClassName('js-upload-files')[0];
    
          initUploadInput(sampleInput);
        }
      }
    }
  }
}