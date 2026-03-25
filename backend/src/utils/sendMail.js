const fs = require('fs');
const path = require('path');
const transporter = require('../config/mailConfig');
const env = require('../config/appConfig');

const loadTemplate = (templateName, variables = {}) => {
  const read = (name) => fs.readFileSync(path.join(__dirname, 'mailTemplates', `${name}.html`), 'utf-8');
  const content = read(templateName);
  let html = read('layout').replace('{{content}}', content);
  Object.entries({ ...variables, year: variables.year ?? new Date().getFullYear() })
    .forEach(([key, val]) => { html = html.replaceAll(`{{${key}}}`, val); });
  return html;
};

const sendMail = async ({ to, subject, template, variables = {}, html, attachments }) => {
  const content = template ? loadTemplate(template, variables) : html;
  const from = `"${env.MAIL_FROM_NAME}" <${env.MAIL_FROM_ADDRESS}>`;
  const mailOptions = { from, to, subject, html: content };
  if (attachments?.length) mailOptions.attachments = attachments;
  return transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
