const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const db = require('../config/db.js');
const passport = require('passport');

// === PAGE REGISTER ===
router.get('/register', (req, res) => {
  res.render('register', { error: null, success: null });
});

// POST Register
router.post('/register', async (req, res) => {
  const { fullname, email, phone, password, confirm_password } = req.body;

  //Vérification des champs
  if (!fullname || !email || !phone || !password || !confirm_password) {
    return res.render('register', { error: 'Tutti i campi sono obbligatori.',success:null });
  }

  // Vérification correspondance mots de passe
  if (password !== confirm_password) {
    return res.render('register', { error: 'Le due password non corrispondono.' ,success:null});
  }

  try {
    //Vérification si l'email existe déjà
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Erreur MySQL :', err);
        return res.render('register', { error: 'Errore del server.' ,success:null});
      }

      if (results.length > 0) {
        // Email déjà enregistré, faire le login
        return res.render('register', { 
          error: 'Questa email è già registrata. Effettua il login invece.',
          success:null,
          alreadyRegistered: true
        });
      }

      //Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insertion du nouvel utilisateur
      const newUser = { fullname, email, phone, password: hashedPassword };
      db.query('INSERT INTO users SET ?', newUser, (err, result) => {
        if (err) {
          console.error(err);
          return res.render('register', { error: 'Errore durante la registrazione.',success:null });
        }

        // Registrazione effettuata
        res.render('register', { 
         error: null, 
         success: 'Registrazione avvenuta con successo! Puoi ora effettuare il login.'
        });
      });
    });
  } catch (err) {
    console.error('Erreur serveur:', err);
    res.render('register', { error: 'Errore interno del server.',success:null });
  }
});


// post login

router.get('/login', (req, res) => {
  res.render('login', { error: null });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error('Erreur Passport :', err);
      return res.render('login', { error: 'Server error, riprovare più tardi.' });
    }

    if (!user) {
      // Si l'authentification échoue (mauvais mail/mot de passe)
      return res.render('login', { error: info ? info.message : 'Email o password non corretti.' });
    }

    // Connexion réussie → enregistrer la session
    req.logIn(user, (err) => {
      if (err) {
        console.error('Erreur login session :', err);
        return res.render('login', { error: 'Errore durante la connessione.' });
      }

      // 🔥 Redirection selon le rôle
      if (user.role === 'admin') {
        return res.redirect('/admin/dashboard');
      } else {
        return res.redirect('/'); // si l'utilisateur n'est pas un admi , le redirige vers la page principale du site
      }
    });
  })(req, res, next);
});




// === LOGOUT ===
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login');
  });
});

module.exports = router;
