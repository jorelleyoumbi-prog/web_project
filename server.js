const express = require('express');
const path = require('path');
const session = require('express-session');
const passport = require('passport');
const db = require('./config/db');
const adminRoutes = require('./routes/admin');



const app = express();

// === Config moteur EJS ===
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// === Middlewares ===
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// === Sessions ===
app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: false
}));

// === Passport ===
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Middleware global pour rendre 'user' accessible dans toutes les vues EJS
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// === Routes ===
app.use('/auth', require('./routes/auth'));   // routes Login ,Register,Logout
app.use('/admin', require('./routes/admin'));
app.use('/booking',require('./routes/booking'));
app.use('/testimonial',require('./routes/testimonial'));

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/index', (req, res) => {
  res.render('index');
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/menu', (req, res) => {
  res.render('menu');
});

app.get('/team', (req, res) => {
  res.render('team');
});

app.get('/testimonial', (req, res) => {
  res.render('testimonial');
});

app.get('/servizi', (req, res) => {
  const dish = req.query.dish || '';
  res.render('servizi', { dish });
});


app.get('/booking', (req, res) => {
  res.render('booking');
});

app.get('/contact', (req, res) => {
  res.render('contact');
});

app.post('/servizi', (req, res) => {
  if (!req.user) {
    return res.render('login', {
      error: 'Devi essere connesso per ordinare!'
    });
  }

  const {
    order_name,
    additional_food,
    quantity,
    date_time,
    address,
    message,
    payment_method
  } = req.body;

  const userId = req.user.id;

  // Vérifier si le plat existe dans la table menu
  const findMenuQuery = 'SELECT id, price FROM menu WHERE name = ? LIMIT 1';
  db.query(findMenuQuery, [order_name], (err, result) => {
    if (err) {
      console.error('Erreur de recherche du plat :', err);
      return res.render('servizi', { dish: order_name, error: 'Erreur interne.' });
    }

    if (result.length === 0) {
      return res.render('servizi', { dish: order_name, error: 'Plat non trouvé dans le menu.' });
    }

    const menuId = result[0].id;
    const price = result[0].price;
    const total_price = price * quantity;

    // Insertion de la commande dans la table orders
    const insertOrder = `
      INSERT INTO orders 
      (user_id, menu_id, additional_food, quantity, date_time, address, message, payment_method, status, total_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertOrder,
      [userId, menuId, additional_food, quantity, date_time, address, message, payment_method, 'in_attesa', total_price],
      (err2, resultInsert) => {
        if (err2) {
          console.error('Erreur lors de l’insertion de la commande :', err2);
          return res.render('servizi', { dish: order_name, error: 'Erreur lors de la commande.' });
        }

        const orderId = resultInsert.insertId;

        // Simulation du paiement
        if (payment_method === 'cash') {
          return res.render('servizi', { dish: order_name, success: 'Ordine registrato! Pagherai alla consegna.' });
        } else {
          return res.redirect(`/payment/${orderId}`);
        }
      }
    );
  });
});



app.get('/register', (req, res) => res.redirect('/auth/register'));

// === SIMULATION DU PAIEMENT ===
app.get('/payment/:id', (req, res) => {
  const orderId = req.params.id;

  // Vérifie que l’utilisateur est connecté
  if (!req.user) {
    return res.render('login', { error: 'Devi effettuare l’accesso per pagare!' });
  }

  // Récupère la commande
  const sql = `
    SELECT o.id, m.name AS dish_name, o.total_price, o.payment_method, o.status
    FROM orders o
    JOIN menu m ON o.menu_id = m.id
    WHERE o.id = ? AND o.user_id = ?
  `;

  db.query(sql, [orderId, req.user.id], (err, results) => {
    if (err) {
      console.error('Erreur récupération commande :', err);
      return res.status(500).send('Erreur interne');
    }

    if (results.length === 0) {
      return res.status(404).send('Commande non trouvée');
    }

    const order = results[0];

    // Si déjà payé, redirige vers la page de succès
    if (order.status === 'confermato') {
      return res.redirect('/payment-success');
    }

    // Simule le paiement automatique (dans la vraie vie, ici irait Stripe ou PayPal)
    const updateSql = `UPDATE orders SET status = 'confermato' WHERE id = ?`;
    db.query(updateSql, [orderId], (err2) => {
      if (err2) {
        console.error('Erreur update paiement :', err2);
        return res.status(500).send('Erreur paiement');
      }

      // Redirige vers la page de succès
      res.redirect('/payment-success');
    });
  });
});


// === PAGE SUCCÈS DU PAIEMENT ===
app.get('/payment-success', (req, res) => {
  if (!req.user) {
    return res.redirect('/auth/login');
  }

  res.render('payment-success', { user: req.user });
});


app.use('/admin', adminRoutes);



// === Démarrage du serveur ===
app.listen(3000, () => {
  console.log("Server listening on port 3000!!");
});

