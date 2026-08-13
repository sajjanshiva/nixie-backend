const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadImage(fileBuffer, fileName, folder = "/nixie/uploads") {
  const uniqueName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${fileName}`;
  const result = await imagekit.upload({
    file: fileBuffer,
    fileName: uniqueName,
    folder,
    useUniqueFileName: false,
  });
  return { url: result.url, fileId: result.fileId };
}

module.exports = { uploadImage };
