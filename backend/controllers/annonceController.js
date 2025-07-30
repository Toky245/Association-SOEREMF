const db = require('../db');

exports.getAllAnnonces = (req, res) => {
  db.query(
    "SELECT nom, prenom FROM membre WHERE role = 'Responsable communication' LIMIT 1",
    (err, membres) => {
      if (err) {
        console.error('Erreur lors de la récupération du responsable communication :', err.message);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      const responsable = membres[0];

      db.query('SELECT * FROM annonce', (err2, annonces) => {
        if (err2) {
          console.error('Erreur lors de la récupération des annonces :', err2.message);
          return res.status(500).json({ error: 'Erreur serveur' });
        }

        const annoncesAvecAuteur = annonces.map((annonce) => ({
          ...annonce,
          auteur: responsable ? `Responsable communication ${responsable.prenom} ${responsable.nom}` : "Responsable communication"
        }));

        res.json(annoncesAvecAuteur);
      });
    }
  );
};

exports.createAnnonce = (req, res) => {
  const { titre, contenus, niveau_importance, debut, fin } = req.body;

  if (!titre || !contenus || !niveau_importance || !debut || !fin) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const sql = `
    INSERT INTO annonce (titre, contenus, niveau_importance, debut, fin)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [titre, contenus, niveau_importance, debut, fin], (err, result) => {
    if (err) {
      console.error('Erreur lors de la création de l’annonce :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }

    res.status(201).json({ message: 'Annonce créée avec succès', id: result.insertId });
  });
};

exports.deleteAnnonceById = (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM annonce WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Erreur lors de la suppression de l'annonce :", err.message);
      return res.status(500).json({ error: "Erreur serveur lors de la suppression" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Annonce non trouvée" });
    }

    res.status(200).json({ message: "Annonce supprimée avec succès" });
  });
};
