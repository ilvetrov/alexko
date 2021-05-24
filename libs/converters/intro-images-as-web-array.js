function getIntroImagesAsWebArray(...introImages) {
  if (!introImages) return [];

  const outputImages = [];
  
  for (let i = 0; i < introImages.length; i++) {
    const images = introImages[i];
    for (const key in images) {
      if (Object.hasOwnProperty.call(images, key)) {
        const image = images[key];
        outputImages.push(image);
      }
    }
  }

  return outputImages;
}

module.exports = getIntroImagesAsWebArray;