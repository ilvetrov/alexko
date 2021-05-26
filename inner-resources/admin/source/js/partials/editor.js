import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import { getEditorImages } from '../../../../../libs/converters/get-editor-images';
import getImgSrc from '../../../../../libs/get-img-src';
import ImageTool from './tools/image'
import NonBreakingSpace from './tools/non-breaking-space';

const editors = {};

const editorsElements = document.querySelectorAll('[data-editorjs]');
for (let i = 0; i < editorsElements.length; i++) {
  const editorElement = editorsElements[i];
  const editorName = editorElement.getAttribute('data-editorjs');
  
  const editor = new EditorJS({
    holder: editorElement,
    placeholder: 'Project text...',
    tools: {
      header: Header,
      list: List,
      nonBreakingSpace: NonBreakingSpace,
      image: {
        class: ImageTool,
        config: {
          captionPlaceholder: 'Alt Text',
          uploader: {
            uploadByFile(file) {
              const formData = new FormData();
              formData.append('files[]', file);
              formData.append('project_id', frontVariables.projectId);
              formData.append('token', frontVariables.adminToken);
              return fetch('/admin/upload', {
                headers: {
                  'Accept': 'application/json'
                },
                method: 'POST',
                body: formData
              })
              .then(response => response.json())
              .then(data => {
                const uploadedImg = data[0];
                return {
                  success: 1,
                  file: {
                    url: `/admin/portfolio/image-preview/${uploadedImg}`,
                    name: uploadedImg
                  }
                };
              });
            }
          },
          actions: [
            {
              name: 'desktopMode',
              icon: '<svg fill="none" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"><path clip-rule="evenodd" d="M1.25 6A2.75 2.75 0 014 3.25h16A2.75 2.75 0 0122.75 6v10A2.75 2.75 0 0120 18.75h-5.787l.75 1.5H17a.75.75 0 010 1.5H7a.75.75 0 010-1.5h2.036l.75-1.5H4A2.75 2.75 0 011.25 16zM20 17.25H4c-.69 0-1.25-.56-1.25-1.25V6c0-.69.56-1.25 1.25-1.25h16c.69 0 1.25.56 1.25 1.25v10c0 .69-.56 1.25-1.25 1.25z" fill-rule="evenodd"/></svg>',
              title: 'Desktop Image'
            }
          ]
        }
      }
    },
    data: frontVariables.editorText && frontVariables.editorText[editorName]
  });

  editors[editorName] = editor;
}

async function getEditorsData() {
  const data = {};

  for (const editorName in editors) {
    if (Object.hasOwnProperty.call(editors, editorName)) {
      const editor = editors[editorName];
      await editor.save().then(editorData => data[editorName] = editorData);
    }
  }

  return data;
}

function getEditorsImages(editorsData) {
  let images = [];

  for (const editorName in editorsData) {
    if (Object.hasOwnProperty.call(editorsData, editorName)) {
      const editorData = editorsData[editorName];
      images = [...images, ...getEditorImages(editorData)];
    }
  }

  return images;
}

module.exports = {
  editors,
  getEditorsData,
  getEditorsImages
}