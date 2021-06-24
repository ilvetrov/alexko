const { CSRF } = require('./csrf');
const isDevelopment = require('./is-development');
const { nonAuthEncryption } = require('./one-string-encryption');
const { getRandomHash } = require('./random');

const cookieTokenName = 'natk';

function publicSecretToCookie(res, secretForPublic) {
  res.cookie(cookieTokenName, secretForPublic, {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    sameSite: true,
    secure: isDevelopment ? undefined : true,
  });
}

function init(req, res) {
  if (req.cookies && req.cookies[cookieTokenName]) {
    try {
      const secret = nonAuthEncryption.decrypt(req.cookies[cookieTokenName]);
      req.nonAuthCsrf = new CSRF(secret);
      return;
    } catch (error) {}
  }

  const secret = getRandomHash(5);
  const secretForPublic = nonAuthEncryption.encrypt(secret);
  const csrf = new CSRF(secret);
  req['nonAuthCsrf'] = csrf;
  publicSecretToCookie(res, secretForPublic);
}

function get(req) {
  return req['nonAuthCsrf'];
}

const nonAuthCsrf = {
  init,
  get
}

module.exports = nonAuthCsrf;