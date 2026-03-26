const { S3Client } = require('@aws-sdk/client-s3');
const env = require('./appConfig');

if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_BUCKET) {
  console.warn('AWS S3 not configured - using local storage only');
}

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = { s3, bucket: env.AWS_BUCKET };
