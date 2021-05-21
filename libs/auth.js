const db = require("../db");
const { getRandomHash } = require("./random");
const { getTimeForPrevDaysInISO } = require("./time");

class LoginSystem {
  constructor(databaseName, codName, cookieName, daysToExpire = 365) {
    this.databaseName = databaseName;
    this.codName = codName;
    this.cookieName = cookieName;
    this.daysToExpire = Number(daysToExpire);
  }

  login(req, res, name, password) {
    if (name && name.trim() !== '' && password && password.trim() !== '') {
      return new Promise((resolve, reject) => {

        this.getUserViaCredentials(name, password)
        .then((user) => {
          if (user) {
            
            this.createSession(res, user.id)
            .then((result) => {
              const session = result[0];
              req[`logged_${this.codName}`] = user;
              req[`session_of_logged_${this.codName}`] = session;
              resolve();
            })
            .catch(() => {
              if (err) throw err;
              reject();
            });

          } else {
            reject();
          }
        });
        
      });
    } else {
      return new Promise((resolve, reject) => {
        reject();
      });
    }
  }

  logout(req, res) {
    return new Promise((resolve, reject) => {
      this.getCurrentSession(req)
      .finally(() => {
        delete req[`logged_${this.codName}`];
        this.removeSessionCookie(res);
      })
      .then((session) => {
        this.removeSession(session.hash)
        .then(() => {
          resolve();
        });
      })
      .catch(() => {
        reject();
      });
    });
  }

  getUserViaCredentials(name, password) {
    return db.oneOrNone(`SELECT * FROM ${this.databaseName} WHERE name=$(name) AND password=$(password) LIMIT 1`, {
      name: name,
      password: password
    });
  }

  #getUserViaId(id) {
    return db.oneOrNone(`SELECT * FROM ${this.databaseName} WHERE id=$(id) LIMIT 1`, {
      id: id
    });
  }

  createSession(res, userId) {
    const hash = getRandomHash();

    this.createSessionCookie(res, hash);
    return db.query('INSERT INTO sessions ("user_id", "hash", "type", "secret") VALUES ($(user_id), $(hash), $(type), $(secret)) RETURNING *', {
      user_id: userId,
      hash: hash,
      type: this.codName,
      secret: getRandomHash(5)
    });
  }

  createSessionCookie(res, hash) {
    res.cookie(this.cookieName, hash, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: true,
      // domain: '.alexko.ltd',
      // secure: true,
    });
  }

  removeSessionCookie(res) {
    res.cookie(this.cookieName, '', {
      maxAge: -1
    });
  }

  getLoggedUser(req) {
    return new Promise((resolve, reject) => {
      if (req[`logged_${this.codName}`]) {
        resolve(req[`logged_${this.codName}`]);
      } else if (req.cookies && req.cookies[this.cookieName]) {
        const hash = req.cookies[this.cookieName];
  
        this.getSession(hash)
        .then((session) => {
          if (!session) {
            reject();
          } else {
  
            this.#getUserViaId(session.user_id)
            .then((user) => {
              if (!user) {
                reject();
              } else {
                delete user.password;
                req[`logged_${this.codName}`] = user;
                req[`session_of_logged_${this.codName}`] = session;
                resolve(user);
              }
            });
  
          }
        });
      } else {
        reject();
      }
    });
  }

  getCurrentSession(req) {
    return new Promise((resolve, reject) => {
      if (req[`session_of_logged_${this.codName}`]) {
        resolve(req[`session_of_logged_${this.codName}`]);
      } else if (req.cookies && req.cookies[this.cookieName]) {
        this.getSession(req.cookies[this.cookieName])
        .then((session) => {
          req[`session_of_logged_${this.codName}`] = session;
          resolve(session);
        });
      } else {
        reject();
      }
    });
  }

  getSession(hash) {
    return db.oneOrNone('SELECT * FROM sessions WHERE hash=$1 LIMIT 1', [hash]);
  }

  removeSession(hash) {
    return db.query('DELETE FROM sessions WHERE hash=$1', [hash]);
  }

}

function removeOldSessions() {
  return db.query('DELETE FROM sessions WHERE "created_at"<$1', [getTimeForPrevDaysInISO(this.daysToExpire)]);
}

removeOldSessions();
setInterval(() => {

  removeOldSessions()
  .then((result) => {
    console.log('Old sessions removed.');
  });

}, 1000 * 60 * 60 * 24);

module.exports = {
  admin: new LoginSystem('admins', 'admin', 'ahsh', 60)
}