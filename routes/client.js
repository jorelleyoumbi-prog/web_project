const express  = require('express');
const router = express.Router();
const db = require('../server');


//middleware pour protéger le client
function ensureClient(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'client') return next();
  res.redirect('/auth/login');
}


// Page profil du client
router.get('/profil', ensureClient, (req, res) => {
  res.render('client/profil', { user: req.user });
});

// Voir ses réservations
router.get('/reservations', ensureClient, (req, res) => {
  const userId = req.user.id;
  db.query('SELECT * FROM reservations WHERE user_id = ?', [userId], (err, results) => {
    if (err) return res.status(500).send("Erreur serveur");
    res.render('client/reservations', { user: req.user, reservations: results });
  });
});

// Créer une nouvelle réservation
router.get('/booking', ensureClient, (req, res) => {
  res.render('client/booking', { user: req.user });
});

router.post('/booking', ensureClient, (req, res) => {
  const { date, time, persons } = req.body;
  const userId = req.user.id;

  db.query(
    'INSERT INTO reservations (user_id, date, time, persons) VALUES (?, ?, ?, ?)',
    [userId, date, time, persons],
    (err) => {
      if (err) return res.status(500).send("Erreur réservation");
      res.redirect('/client/reservations');
    }
  );
});

module.exports = router;

