const nodemailer = require('nodemailer');
const env = require('./appConfig');

// ssl  = port 465, secure from the start
// tls  = port 587/2525, STARTTLS upgrade
// none = no encryption (dev/mailtrap)
const secure = env.MAIL_ENCRYPTION === 'ssl';

const transporter = nodemailer.createTransport({
  host: env.MAIL_HOST,
  port: env.MAIL_PORT,
  secure,
  auth: {
    user: env.MAIL_USERNAME,
    pass: env.MAIL_PASSWORD,
  },
  ...(env.MAIL_ENCRYPTION === 'tls' && {
    tls: { rejectUnauthorized: false },
  }),
});

module.exports = transporter;
