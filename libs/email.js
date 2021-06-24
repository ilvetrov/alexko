const nodemailer = require('nodemailer');
const isDevelopment = require('./is-development');

class Email {
  static #secureOptions = !isDevelopment ? {
    port: 465,
    secure: true
  } : {
    port: 587,
    tls: {
      rejectUnauthorized: false
    }
  }

  constructor(email, password, rewriteOptions = {}) {
    this.email = email;

    this.transport = nodemailer.createTransport({ ...Email.#secureOptions, ...{
      host: 'alexko.ltd',
      auth: {
        user: email,
        pass: password
      }
    }, ...rewriteOptions});
  }

  sendMail(to, subject, text) {
    return this.transport.sendMail({
      from: `"AlexKo" <${this.email}>`,
      to: to,
      subject: subject,
      text: text
    })
    .catch(console.error);
  }
}

const noreplyEmail = new Email('noreply@alexko.ltd', process.env['EMAIL_PASSWORD_NOREPLY']);

module.exports = {
  noreplyEmail
}