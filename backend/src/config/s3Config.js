const { S3Client } = require('@aws-sdk/client-s3');
const env = require('./appConfig');

let s3 = null;

if (env?.STORAGE_TYPE?.includes('s3')) {
  const missing = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY', 'AWS_REGION', 'AWS_BUCKET']
    .filter(k => !env[k]);
  if (missing.length) {
    console.error(`[S3] Missing config: ${missing.join(', ')} — S3 disabled.`);
  } else {
    s3 = new S3Client({
      region: env.AWS_REGION,
      credentials: {
        accessKeyId: env.AWS_ACCESS_KEY_ID,
        secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      },
    });
  }
}

module.exports = { s3, bucket: env?.AWS_BUCKET };
