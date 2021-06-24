const { getRandomHash } = require("./random");
const sha1 = require("./sha1");

class CSRF {
  static getCurrentToken(req) {
    if (req?.query?.token) return req.query.token;
    if (req?.body?.token) return req.body.token;
    return false;
  }

  constructor(secret) {
    this.#secret = secret;
  }

  #secret;

  createNewToken() {
    return this.createTokenViaKey(getRandomHash(4));
  }

  get newToken() {
    return this.createNewToken();
  }
  
  createTokenViaKey(key) {
    const secret = this.#secret;
    return key + ':' + sha1(key + secret + sha1(key));
  }
  
  checkToken(token) {
    if (!(token && typeof token === 'string' && token.trim())) return false;
  
    const key = token.split(':')[0];
    return token === this.createTokenViaKey(key);
  }
}

module.exports = {
  CSRF
}