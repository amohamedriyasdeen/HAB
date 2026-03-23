const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { s3, bucket } = require('../config/s3Config');
const env = require('../config/appConfig');

const memoryStorage = multer.memoryStorage();
const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.uploadFolder || 'uploads';
    const uploadPath = path.join(__dirname, '../../public', folder);
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname || 'file.jpg';
    cb(null, `${Date.now()}-${originalName}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) return cb(null, true);
  cb(new Error('Only .jpg, .jpeg, .png files are allowed'));
};

const uploadSingle = (folder, storageType = 'public') => (req, res, next) => {
  req.uploadFolder = folder;
  const storage = storageType === 's3' ? memoryStorage : diskStorage;
  const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
  upload.single('image')(req, res, next);
};

const uploadFile = async (file, folder, storageType) => {
  const originalName = file.originalname || 'file.jpg';
  const filename = `${Date.now()}-${originalName}`;
  
  if (storageType === 's3') {
    const key = `${folder}/${filename}`;
    const params = { Bucket: bucket, Key: key, Body: file.buffer, ContentType: file.mimetype };
    await s3.upload(params).promise();
    return { s3_path: key, original_name: originalName };
  }
  
  return `${folder}/${filename}`;
};

const deleteFile = async (filePath, storageType) => {
  if (storageType === 's3') {
    const key = typeof filePath === 'object' ? filePath.s3_path : filePath.split('.amazonaws.com/')[1] || filePath;
    await s3.deleteObject({ Bucket: bucket, Key: key }).promise();
  } else {
    const fullPath = path.join(__dirname, '../../public', filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }
};

const getSignedUrl = (s3Path) =>
  s3.getSignedUrl('getObject', { Bucket: bucket, Key: s3Path, Expires: 300 });

const resolveFileUrl = (fileData, storageType) => {
  if (storageType === 's3') {
    if (Array.isArray(fileData)) {
      return fileData.map(f => ({ ...f, signed_url: getSignedUrl(f.s3_path) }));
    }
    if (fileData?.s3_path) return { ...fileData, signed_url: getSignedUrl(fileData.s3_path) };
    // legacy: full URL string
    const key = typeof fileData === 'string' && fileData.startsWith('http')
      ? decodeURIComponent(fileData.split('.amazonaws.com/')[1])
      : fileData;
    return { s3_path: key, signed_url: getSignedUrl(key) };
  }
  return `${env.BASE_URL}/${fileData}`;
};

module.exports = { uploadSingle, uploadFile, deleteFile, resolveFileUrl };