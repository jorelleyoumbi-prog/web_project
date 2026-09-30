const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Afficher la page des avis
router.get("/", (req, res) => {
  db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err, reviews) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Erreur lors du chargement des avis.");
    }

    res.render("testimonial", {
      user: req.user || null,
      reviews,
      error: null,
      success: null,
    });
  });
});

// Ajouter un avis
router.post("/add", (req, res) => {
  const { fullname, email, message, rating } = req.body;

  if (!fullname || !message || !rating) {
    return db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err, reviews) => {
      if (err) return res.status(500).send("Erreur serveur");
      res.render("testimonial", {
        user: req.user || null,
        reviews,
        error: " Tutti i campi obbligatori devono essere compilati",
        success: null,
      });
    });
  }

  db.query(
    "INSERT INTO reviews (fullname, email, message, rating) VALUES (?, ?, ?, ?)",
    [fullname, email || null, message, rating],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Erreur lors de l’envoi de l’avis.");
      }

      db.query("SELECT * FROM reviews ORDER BY created_at DESC", (err2, reviews) => {
        if (err2) return res.status(500).send("Erreur serveur");
        res.render("testimonial", {
          user: req.user || null,
          reviews,
          error: null,
          success: "Grazie per la sua ricensione!!",
        });
      });
    }
  );
});

module.exports = router;
