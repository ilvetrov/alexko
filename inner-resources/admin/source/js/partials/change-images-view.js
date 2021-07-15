const dataAttributeName = 'data-change-images-view';
const changersOfImagesView = document.querySelectorAll(`[${dataAttributeName}]`);
const imagesViewOutput = document.getElementsByClassName('js-images-view-output')[0];

for (let i = 0; i < changersOfImagesView.length; i++) {
  const changerOfImagesView = changersOfImagesView[i];
  const imagesViewSection = changerOfImagesView.parentElement;
  const nextChangerOfImagesView = changersOfImagesView[Number(!i)];
  const nextImagesViewSection = nextChangerOfImagesView.parentElement;

  changerOfImagesView.addEventListener('click', function() {
    imagesViewSection.classList.add('disabled');
    nextImagesViewSection.classList.remove('disabled');

    imagesViewOutput.value = nextChangerOfImagesView.getAttribute(dataAttributeName);
  });
}