import Compressor from 'compressorjs';
export const imageCompress = async (image) => {
  if (!image) {
    return;
  }
  return await new Promise((resolve, reject) => {
    new Compressor(image, {
      quality: 0.8,
      convertSize: 4000000,
      success: resolve,
      error: reject,
    });
  });
};
