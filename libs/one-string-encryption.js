const crypto = require('crypto');

class OneStringEncryption {
  constructor(secretKey) {
    this.#encryptKey = crypto.createHash('sha256').update(String(secretKey)).digest('base64').substr(0, 32);
  }

  #encryptKey;

  encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-ctr', this.#encryptKey, iv);
    const encrypted = cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    const final = crypto.randomBytes(2).toString('hex') + encrypted + iv.toString('hex') + crypto.randomBytes(2).toString('hex');
    return final;
  }
  
  decrypt(text) {
    const withoutSalt = text.slice(4, -4);
    const iv = Buffer.from(withoutSalt.slice(-32), 'hex');
    const encrypted = withoutSalt.slice(0, -32);
    const decipher = crypto.createDecipheriv('aes-256-ctr', this.#encryptKey, iv);
    const decrypted = decipher.update(encrypted, 'hex', 'utf8') + decipher.final('utf8');
    return decrypted;
  }
}

const nonAuthEncryption = new OneStringEncryption(process.env.NON_AUTH_ENCRYPT_KEY);

module.exports = {
  nonAuthEncryption
}