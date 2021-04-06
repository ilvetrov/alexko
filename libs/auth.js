const db = require("../db");
const { createSession } = require("./sessions");

class LoginSystem {
  constructor (loginType, query) {
    this.loginType = loginType;
    this.query = query;
  }
  
  login(req, res, name, password) {
    if (name && name.trim() !== '' && password && password.trim() !== '') {
      return new Promise((resolve, reject) => {

        this.getUser(name, password)
        .then((result) => {
          if (result.length > 0) {
            
            createSession(req, res, result[0].id, this.loginType);
            resolve(true);

          } else {
            resolve(false);
          }
        });
        
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(false);
      });
    }
  }

  getUser(name, password) {
    return this.query(name, password);
  }
}

const admin = new LoginSystem('ahsh', (name, password) => {
  return db.query('SELECT * FROM admins WHERE name=$(name) AND password=$(password)', {
    name: name,
    password: password
  });
});

module.exports = {
  admin
}