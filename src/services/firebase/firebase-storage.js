const { getStorage } = require('firebase-admin/storage');

const bucket = getStorage().bucket();


const uploadFile = async (path, file, onFinish, onError) => {
  const fileToUpload = bucket.file(path);
  const stream = fileToUpload.createWriteStream({
    metadata: {
      contentType: null
    }
  });
  stream.end(file);
  stream.on('finish', async () => {
    const [url] = await fileToUpload.getSignedUrl({ action: 'read', expires: '01-01-2030' });
    onFinish(url);
  });
  stream.on('error', async () => {
    onError();
  });
}

const deleteFile = async (prefix,url,onFinish, onError) => {
  try {
    const urlParts = url.split("/");
    const fileNameWithParams = urlParts[urlParts.length - 1];
    const filepath = fileNameWithParams.split("?")[0];
    const fileToDelete = bucket.file(`${prefix}/${filepath}`);
    await fileToDelete.delete();
    onFinish();
  } catch (error) {
    console.log(error);
    onError(error);
  }
}

module.exports = { uploadFile ,deleteFile};


