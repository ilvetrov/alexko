const db = require("../db");
const { getRandomHash } = require("./random");

function createSession(req, res, userId, loginType) {
  const hash = getRandomHash();

  db.query('INSERT INTO sessions ("user_id", "hash", "type") VALUES ($(user_id), $(hash), $(type))', {
    user_id: userId,
    hash: hash,
    type: loginType
  });
  res.cookie(loginType, hash, {maxAge: 1000 * 60 * 60 * 24});

  req[`logged_of_${loginType}`] = userId;
}

function removeOldSessions() {
  return db.query('DELETE FROM sessions WHERE "created_at"<$1', [getTimeForPrevMonthInISO()]);
}

function getTimeForPrevMonthInISO() {
  return (new Date(
    (new Date()).getTime() - 1000 * 60 * 60 * 24 * 30
  )).toISOString();
}

removeOldSessions();
setInterval(() => {

  removeOldSessions()
  .then((result) => {
    console.log('Cleaning of old sessions completed.');
  });

}, 1000 * 60 * 60 * 24);

module.exports = {
  createSession
}