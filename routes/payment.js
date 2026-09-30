// === Simulation du paiement ===
app.get('/payment/:orderId', (req, res) => {
  const orderId = req.params.orderId;

  const sql = `
    SELECT o.id, o.quantity, m.name AS dish_name, m.price, o.payment_method
    FROM orders o
    JOIN menu m ON o.menu_id = m.id
    WHERE o.id = ? AND o.user_id = ?
  `;

  db.query(sql, [orderId, req.user.id], (err, results) => {
    if (err || results.length === 0) {
      console.error(err);
      return res.status(404).send('Ordine non trovato.');
    }

    const order = results[0];
    order.total = order.quantity * order.price;

    res.render('payment', { user: req.user, order });
  });
});

app.post('/payment/:orderId/confirm', (req, res) => {
  const orderId = req.params.orderId;

  const sql = "UPDATE orders SET status = 'pagato' WHERE id = ?";
  db.query(sql, [orderId], (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Errore pagamento.');
    }

    res.render('payment-success', { user: req.user });
  });
});
