const express = require('express');
const router = express.Router();
const db = require('../config/db');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'client') {
    return next();
  }
  res.redirect('/auth/login');
}

router.post('/', ensureAuthenticated, (req, res) => {
  const { fullname, email, phone, num_persons, date, time } = req.body;

  const sql = `
    INSERT INTO reservations (user_id, fullname, email, phone, num_persons, date, time)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [req.user.id, fullname, email, phone, num_persons, date, time], (err) => {
    if (err) {
      console.error('Erreur MySQL :', err);
      return res.status(500).send('Errore durante la riservazione.');
    }

    res.render('booking', { user: req.user, success: 'Riservazione registrata con successo!!!' });
  });
});

module.exports = router;
