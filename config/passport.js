const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const db = require('../config/db'); 

module.exports = function (passport) {
  // strategie du login
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email', 
        passwordField: 'password',
      },
      (email, password, done) => {
        // Recherche de l'utilisateur par email
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
          if (err) return done(err);
          if (results.length === 0) return done(null, false, { message: 'Utilisateur introuvable.' });

          const user = results[0];

          // Comparer le mot de passe
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return done(null, false, { message: 'Mot de passe incorrect.' });

          return done(null, user);
        });
      }
    )
  );

  // === SERIALIZE USER ===
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // === DESERIALIZE USER ===
  passport.deserializeUser((id, done) => {
    db.query('SELECT * FROM users WHERE id = ?', [id], (err, results) => {
      if (err) return done(err);
      const user = results[0];

      //verifie Si le  champ "role" existe dans la table "users"
      if (user) {
        done(null, {
          id: user.id,
          fullname: user.fullname,
          email: user.email,
          role: user.role, // très important pour les routes admin
        });
      } else {
        done(null, false);
      }
    });
  });
};
