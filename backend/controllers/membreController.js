const db = require('../db');

// Récupérer tous les membres
exports.getAllMembres = (req, res) => {
  db.query('SELECT * FROM membre', (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des membres :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json(results);
  });
};

// Créer un nouveau membre
exports.createMembre = (req, res) => {
  const { nom, prenom, email, telephone, promotion, role } = req.body;

  if (!nom || !prenom || !email || !telephone || !promotion || !role) {
    return res.status(400).json({ error: 'Tous les champs sont requis' });
  }

  const sql = `
    INSERT INTO membre (nom, prenom, email, telephone, promotion, role)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(sql, [nom, prenom, email, telephone, promotion, role], (err, result) => {
    if (err) {
      console.error('Erreur lors de l’insertion du membre :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.status(201).json({ message: 'Membre ajouté avec succès', id: result.insertId });
  });
};

// Récupérer un membre par ID
exports.getMembreById = (req, res) => {
  const id = req.params.id;
  db.query('SELECT * FROM membre WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du membre :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'Membre non trouvé' });
    }
    res.json(results[0]);
  });
};

// Supprimer un membre
exports.deleteMembre = (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM membre WHERE id = ?', [id], (err) => {
    if (err) {
      console.error('Erreur lors de la suppression :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json({ message: 'Membre supprimé avec succès' });
  });
};

// Mettre à jour un membre
exports.updateMembre = (req, res) => {
  const id = req.params.id;
  const { nom, prenom, email, telephone, promotion, role } = req.body;

  const sql = `
    UPDATE membre 
    SET nom = ?, prenom = ?, email = ?, telephone = ?, promotion = ?, role = ? 
    WHERE id = ?
  `;

  db.query(sql, [nom, prenom, email, telephone, promotion, role, id], (err) => {
    if (err) {
      console.error('Erreur lors de la mise à jour :', err.message);
      return res.status(500).json({ error: 'Erreur serveur' });
    }
    res.json({ message: 'Membre mis à jour avec succès' });
  });
};
