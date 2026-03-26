const multer = require('multer');
const path = require('path');
const fs = require('fs');
const env = require('../config/appConfig');
const { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const getS3 = () => require('../config/s3Config');

// --- Storage detection ---
// S3 stored value is always an object: { s3_path: 'folder/file.jpg' }
// Local stored value is always a string: 'uploads/profiles/file.jpg'
const isS3 = (value) => value !== null && typeof value === 'object' && typeof value.s3_path === 'string';
const isLocal = (value) => typeof value === 'string' && !value.startsWith('http');

// --- Multer storages ---
const memoryStorage = multer.memoryStorage();

const diskStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public', req._uploadFolder);
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

// --- Middleware ---
// storageType: 's3' | 'public'  (default from STORAGE_TYPE env)
// allowedTypes: e.g. ['jpeg','jpg','png','pdf']
const uploadSingle = (
  folder,
  fieldName = 'file',
  storageType = env.STORAGE_TYPE || 'public',
  allowedTypes = ['jpeg', 'jpg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx']
) => (req, res, next) => {
  req._uploadFolder = folder;
  req._storageType  = storageType;

  const storage = storageType === 's3' ? memoryStorage : diskStorage;

  const filter = (_, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase().replace('.', '');
    const mime = file.mimetype;
    const ok   = allowedTypes.some(t => ext === t || mime.includes(t));
    ok ? cb(null, true) : cb(new Error(`File type not allowed. Allowed: ${allowedTypes.join(', ')}`));
  };

  multer({ storage, fileFilter: filter, limits: { fileSize: 10 * 1024 * 1024 } })
    .single(fieldName)(req, res, next);
};

// --- Upload ---
const uploadFile = async (file, folder, storageType = env.STORAGE_TYPE || 'public') => {
  if (storageType === 's3') {
    const { s3, bucket } = getS3();
    const filename = `${Date.now()}-${file.originalname}`;
    const key = `${folder}/${filename}`;
    await s3.send(new PutObjectCommand({ Bucket: bucket, Key: key, Body: file.buffer, ContentType: file.mimetype }));
    return { s3_path: key };
  }
  // local: multer diskStorage already saved the file with file.filename — use that exact name
  console.log(`${folder}/${file.filename}`);
  return `${folder}/${file.filename}`;
};

// --- Delete ---
const deleteFile = async (stored) => {
  if (!stored) return;
  try {
    if (isS3(stored)) {
      const { s3, bucket } = getS3();
      await s3.send(new DeleteObjectCommand({ Bucket: bucket, Key: stored.s3_path }));
    } else if (isLocal(stored)) {
      const full = path.join(__dirname, '../../public', stored);
      if (fs.existsSync(full)) fs.unlinkSync(full);
    }
  } catch (err) {
    console.warn('[fileUpload] deleteFile failed:', err.message);
  }
};

// --- Resolve to public URL ---
// S3  → signed URL (valid 5 min)
// Local → BASE_URL/uploads/... (served by express static)
const resolveFileUrl = async (stored) => {
  if (!stored) return null;
  if (isS3(stored)) {
    const { s3, bucket } = getS3();
    const url = await getSignedUrl(s3, new GetObjectCommand({ Bucket: bucket, Key: stored.s3_path }), { expiresIn: 300 });
    return url;
  }
  if (isLocal(stored)) {
    return `${env.BASE_URL}/${stored}`;
  }
  return stored; // already a full URL (e.g. OAuth avatar)
};

module.exports = { uploadSingle, uploadFile, deleteFile, resolveFileUrl, isS3, isLocal };
