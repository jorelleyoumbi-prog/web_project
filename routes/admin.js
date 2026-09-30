const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Middleware admin
function ensureAdmin(req, res, next) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).send('Access Denied: Admin only');
}


// Dashboard admin

// Route racine admin ,redirige vers le dashboard
router.get('/', ensureAdmin, (req, res) => {
  res.redirect('/admin/dashboard');
});

router.get('/dashboard', ensureAdmin, (req, res) => {
  const stats = {};

  // nombre d’utilisateurs
  db.query('SELECT COUNT(*) AS totalUsers FROM users', (err, usersResult) => {
    if (err) return res.status(500).send('Erreur DB (users)');

    stats.totalUsers = usersResult[0].totalUsers;

    // Nombre de réservations
    db.query('SELECT COUNT(*) AS totalReservations FROM reservations', (err, reservationsResult) => {
      if (err) return res.status(500).send('Erreur DB (reservations)');

      stats.totalReservations = reservationsResult[0].totalReservations;

      //Nombre de plats
      db.query('SELECT COUNT(*) AS totalDishes FROM menu', (err, dishesResult) => {
        if (err) return res.status(500).send('Erreur DB (menu)');

        stats.totalDishes = dishesResult[0].totalDishes;

        //Envoi des données à la vue
        res.render('admin/dashboard', {
          user: req.user,
          stats
        });
      });
    });
  });
});


//gérer les users

router.get('/users', ensureAdmin, (req, res) => {
  
  db.query('SELECT id, fullname, role, email, phone FROM users', (err, results) => {
    if (err) return res.status(500).send('Erreur DB');
    res.render('admin/users', { user: req.user, users: results,error:null,success:null });
  });
});

// Ajouter un utilisateur
router.get('/users/add', ensureAdmin, (req, res) => {
  res.render('admin/users', { user: req.user, error: null, success: null });
});

router.post('/users/add', ensureAdmin, (req, res) => {
  const { fullname, email, phone, password, role } = req.body;

  if (!fullname || !email || !phone || !password) {
    return res.render('admin/users', { user: req.user, error: 'Tutti i campi sono obbligatori', success: null });
  }

  const bcrypt = require('bcryptjs');
  const hashedPassword = bcrypt.hashSync(password, 10);

  db.query(
    'INSERT INTO users (fullname, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
    [fullname, email, phone, hashedPassword, role || 'client'],
    (err) => {
      if (err) {
        console.error(err);
        return res.render('admin/users', { user: req.user, error: 'Erreur durant l ajout', success: null });
      }
      res.render('admin/users', { user: req.user, success: 'Utilisateur ajouté avec succès', error: null });
    }
  );
});

// Supprimer un utilisateur 
router.post('/users/delete/:id', ensureAdmin, (req, res) => {
  const userId = req.params.id;
  

  // Empêche de supprimer un admin
  db.query('DELETE FROM users WHERE id = ? AND role != "admin"', [userId], (err) => {
    if (err) return res.status(500).send('Erreur suppression');
    res.redirect('/admin/users');
  });
});


// Modifier un utilisateur 
router.get('/users/edit/:id', ensureAdmin, (req, res) => {
  const userId = req.params.id;

  db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(404).send('Utilisateur non trouvé');
    }
    res.render('admin/edit-user', { user: req.user, editUser: results[0], error: null, success: null });
  });
});

router.post('/users/edit/:id', ensureAdmin, (req, res) => {
  const userId = req.params.id;
  const { fullname, email, phone, role } = req.body;

  db.query(
    'UPDATE users SET fullname = ?, email = ?, phone = ?, role = ? WHERE id = ?',
    [fullname, email, phone, role, userId],
    (err) => {
      if (err) {
        console.error(err);
        return res.render('admin/edit-user', { user: req.user, error: 'Erreur lors de la mise à jour', success: null });
      }
      res.redirect('/admin/users');
    }
  );
});



//*** Gestion du menu***


// Voir tous les plats
router.get('/menu', ensureAdmin, (req, res) => {
  db.query('SELECT * FROM menu', (err, results) => {
    if (err) return res.status(500).send('Erreur DB');
    res.render('admin/menu', { user: req.user, menu: results, error: null, success: null });
  });
});

// Ajouter un plat
router.post('/menu/add', ensureAdmin, (req, res) => {
  const { name, price, image } = req.body;

  if (!name || !price) {
    return db.query('SELECT * FROM menu', (err, results) => {
      res.render('admin/menu', {
        user: req.user,
        menu: results,
        error: 'Il nome ed il prezzo sono obbligatori ',
        success: null
      });
    });
  }

  db.query(
    'INSERT INTO menu (name,price, image) VALUES (?, ?, ?)',
    [name, price,image],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erreur ajout plat');
      }
      res.redirect('/admin/menu');
    }
  );
});

// Modifier un plat
router.post('/menu/edit/:id', ensureAdmin, (req, res) => {
  const { name, price, image } = req.body;
  const id = req.params.id;

  db.query(
    'UPDATE menu SET name=?,  price=? ,image=? WHERE id=?',
    [name, price,image, id],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erreur mise à jour');
      }
      res.redirect('/admin/menu');
    }
  );
});

// Supprimer un plat
router.post('/menu/delete/:id', ensureAdmin, (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM menu WHERE id=?', [id], (err) => {
    if (err) return res.status(500).send('Errore suppressione');
    res.redirect('/admin/menu');
  });
});

// gestion riservazioni

// === GESTION DES RÉSERVATIONS (ADMIN) ===
router.get('/reservations', ensureAdmin, (req, res) => {
  const search = req.query.search || '';

  let query = `
    SELECT reservations.*, users.fullname, users.email, users.phone
    FROM reservations
    JOIN users ON reservations.user_id = users.id
  `;

  const params = [];

  if (search) {
    query += ` WHERE users.fullname LIKE ? OR users.email LIKE ? OR users.phone LIKE ?`;
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).send("Erreur DB");

    res.render('admin/reservations', {
      user: req.user,
      reservations: results,
      error: null,       
      success: null,     
      search              
    });
  });
});

//GESTION DELLE RICENSIONI
router.get('/reviews', ensureAdmin, (req, res) => {
  db.query('SELECT * FROM reviews ORDER BY created_at DESC', (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors du chargement des recensions");
    }
    res.render('admin/reviews', { user: req.user, reviews: results });
  });
});

// Supprimer une recension
router.post('/reviews/delete/:id', ensureAdmin, (req, res) => {
  const reviewId = req.params.id;
  db.query('DELETE FROM reviews WHERE id = ?', [reviewId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors de la suppression de la recension");
    }
    res.redirect('/admin/reviews');
  });
});

// === GESTIONE ORDINI ===
router.get('/orders', (req, res) => {
  if (req.user && req.user.role === 'admin') {
    const sql = `
      SELECT o.id, u.fullname AS client_name, m.name AS dish_name, o.quantity, o.total_price,
             o.date_time, o.status, o.address
      FROM orders o
      LEFT JOIN users u ON o.user_id = u.id
      LEFT JOIN menu m ON o.menu_id = m.id
      ORDER BY o.date_time DESC
    `;
    db.query(sql, (err, results) => {
      if (err) return res.status(500).send('Erreur DB');
      res.render('admin/orders', { orders: results });
    });
  } else {
    res.redirect('/login');
  }
});

// Confirmer une commande
router.post('/orders/confirm/:id', (req, res) => {
  const sql = "UPDATE orders SET status = 'confermato' WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).send('Erreur DB');
    res.redirect('/admin/orders');
  });
});

// Supprimer une commande
router.post('/orders/delete/:id', (req, res) => {
  const sql = "DELETE FROM orders WHERE id = ?";
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).send('Erreur DB');
    res.redirect('/admin/orders');
  });
});



module.exports = router;
