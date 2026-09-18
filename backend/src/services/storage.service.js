const ImageKit = require('@imagekit/nodejs');

const imagekit = new ImageKit({
  privateKey: process.env.ImageKit_Private_Key,
  publicKey: process.env.ImageKit_Public_Key,
  urlEndpoint: process.env.ImageKit_Url_Endpoint,
});

async function uploadFile(buffer, fileName = 'snapshot-post.jpg') {
  if (!buffer || !Buffer.isBuffer(buffer)) {
    throw new Error('A valid image buffer is required.');
  }

  const result = await imagekit.files.upload({
    file: buffer.toString('base64'),
    fileName,
    useUniqueFileName: true,
    folder: '/snapShot/posts',
  });

  return result;
}

module.exports = uploadFile;