const nodemailer = require('nodemailer');
const env = require('./appConfig');

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure: false,
  auth: {
    user: env.MAIL_USERNAME,
    pass: env.MAIL_PASSWORD,
  },
  tls: { rejectUnauthorized: false },
});

module.exports = transporter;
