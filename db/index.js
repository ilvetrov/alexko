const pgp = require('pg-promise')();

const db = pgp({
  host: 'localhost',
  port: 5432,
  database: 'alexko',
  user: 'alexko',
  password: '111'
});

module.exports = db;