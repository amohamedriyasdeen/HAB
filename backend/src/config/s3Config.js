const AWS = require('aws-sdk');
const env = require('./appConfig');

if (!env.AWS_ACCESS_KEY_ID || !env.AWS_SECRET_ACCESS_KEY || !env.AWS_BUCKET) {
  console.warn('AWS S3 not configured - using local storage only');
}

AWS.config.update({
  accessKeyId: env.AWS_ACCESS_KEY_ID,
  secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  region: env.AWS_REGION
});

const s3 = new AWS.S3();

module.exports = { s3, bucket: env.AWS_BUCKET };