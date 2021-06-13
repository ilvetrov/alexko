function normalizeIntroImages(introImages) {
  const introImagesInArray = [];
  for (const order in introImages) {
    if (Object.hasOwnProperty.call(introImages, order)) {
      const introImage = introImages[order];
      introImagesInArray.push(introImage);
    }
  }

  const output = {};
  for (let i = 0; i < introImagesInArray.length; i++) {
    const introImage = introImagesInArray[i];
    output[i] = introImage;
  }

  return output;
}

module.exports = normalizeIntroImages;