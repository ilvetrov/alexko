const db = require("../db");
const { getRandomHash } = require("./random");
const sha1 = require("./sha1");
const { getTimeForPrevDaysInISO } = require("./time");

class LoginSystem {
  constructor(databaseName, codeName, cookieName) {
    this.databaseName = databaseName;
    this.codeName = codeName;
    this.cookieName = cookieName;
  }

  login(req, res, name, password) {
    if (name && name.trim() !== '' && password && password.trim() !== '') {
      return new Promise((resolve, reject) => {

        this.getUserViaCredentials(name, sha1(password))
        .then((user) => {
          if (user) {
            
            this.createSession(res, user.id)
            .then((result) => {
              const session = result[0];
              req[`logged_${this.codeName}`] = user;
              req[`session_of_logged_${this.codeName}`] = session;
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
        delete req[`logged_${this.codeName}`];
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
      type: this.codeName,
      secret: getRandomHash(5)
    });
  }

  createSessionCookie(res, hash) {
    res.cookie(this.cookieName, hash, {
      maxAge: 1000 * 60 * 60 * 24 * 365,
      httpOnly: true,
      sameSite: true,
      domain: res.locals.isDevelopment ? undefined : '.alexko.ltd',
      secure: res.locals.isDevelopment ? undefined : true,
    });
  }

  removeSessionCookie(res) {
    res.cookie(this.cookieName, '', {
      maxAge: -1
    });
  }

  getLoggedUser(req) {
    return new Promise((resolve, reject) => {
      if (req[`logged_${this.codeName}`]) {
        resolve(req[`logged_${this.codeName}`]);
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
                req[`logged_${this.codeName}`] = user;
                req[`session_of_logged_${this.codeName}`] = session;
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
      if (req[`session_of_logged_${this.codeName}`]) {
        resolve(req[`session_of_logged_${this.codeName}`]);
      } else if (req.cookies && req.cookies[this.cookieName]) {
        this.getSession(req.cookies[this.cookieName])
        .then((session) => {
          req[`session_of_logged_${this.codeName}`] = session;
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
  return db.query('DELETE FROM sessions WHERE "created_at"<$1', [getTimeForPrevDaysInISO(60)]);
}

removeOldSessions();
setInterval(() => {

  removeOldSessions()
  .then((result) => {
    console.log('Old sessions removed.');
  });

}, 1000 * 60 * 60 * 24);

module.exports = {
  admin: new LoginSystem('admins', 'admin', 'ahsh')
}