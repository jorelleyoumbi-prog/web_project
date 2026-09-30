const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Vérifie si l'utilisateur est connecté et est un client
function ensureClient(req, res, next) {
  if (req.user && req.user.role === "client") return next();
  return res.redirect("/auth/login");
}

// Ajouter un plat depuis le menu
router.post("/add", ensureClient, (req, res) => {
  const { menu_id, quantity } = req.body;
  const user_id = req.user.id;

  const sql = `
    INSERT INTO orders (user_id, menu_id, quantity, date_time, address, status)
    VALUES (?, ?, ?, NOW(), 'non_specifié', 'in_attesa')
  `;
  db.query(sql, [user_id, menu_id, quantity], (err) => {
    if (err) {
      console.error("Erreur MySQL :", err);
      return res.status(500).send("Erreur lors de l’ajout de la commande");
    }
    res.redirect("/orders/cart");
  });
});

// Voir le panier
router.get("/cart", ensureClient, (req, res) => {
  const sql = `
    SELECT orders.id, orders.quantity, orders.status, menu.name AS dish_name, menu.price, menu.image_url
    FROM orders
    JOIN menu ON orders.menu_id = menu.id
    WHERE orders.user_id = ? AND orders.status = 'in_attesa'
  `;
  db.query(sql, [req.user.id], (err, results) => {
    if (err) return res.status(500).send("Erreur DB");
    res.render("cart", { orders: results, user: req.user });
  });
});

// Supprimer un plat du panier
router.post("/delete/:id", ensureClient, (req, res) => {
  db.query("DELETE FROM orders WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).send("Erreur suppression");
    res.redirect("/orders/cart");
  });
});

// Confirmer le paiement (simulation)
router.post("/confirm", ensureClient, (req, res) => {
  const sql = `UPDATE orders SET status = 'confermato' WHERE user_id = ? AND status = 'in_attesa'`;
  db.query(sql, [req.user.id], (err) => {
    if (err) return res.status(500).send("Erreur confirmation");
    res.render("payment-success", { user: req.user });
  });
});

module.exports = router;
