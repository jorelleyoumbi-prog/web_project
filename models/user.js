const db = require('../server');

const findUserByUsername = (username, callback) => {
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return callback(err);
    callback(null, results[0]);
  });
};

const createUser = (username, hashedPassword, role, email, phone, callback) => {
  db.query(
    'INSERT INTO users (username, password, role, email, phone) VALUES (?, ?, ?, ?, ?)',
    [username, hashedPassword, role, email, phone],
    callback
  );
};

module.exports = { findUserByUsername,  createUser};