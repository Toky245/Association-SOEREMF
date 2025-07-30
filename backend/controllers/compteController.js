const db = require('../db');


exports.getAllUsers = (req, res) => {
  const sql = 'SELECT id, nom, email, promotion, role, valide FROM authentification';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération des utilisateurs :', err);
      return res.status(500).json({ error: 'Erreur serveur lors de la récupération des utilisateurs.' });
    }

    return res.json({ users: results });
  });
};


exports.updateValidationAndRole = (req, res) => {
  let { email, valide, role } = req.body;
  valide = valide === true || valide === 'true';

  if (!email || typeof valide === 'undefined') {
    return res.status(400).json({ error: 'Paramètres manquants : email ou valide.' });
  }

  if (valide) {
    if (!role) {
      return res.status(400).json({ error: 'Le rôle est requis lors de la validation.' });
    }

    const sql = 'UPDATE authentification SET valide = ?, role = ? WHERE email = ?';
    db.query(sql, [valide, role, email], (err, result) => {
      if (err) {
        console.error('Erreur lors de la mise à jour :', err);
        return res.status(500).json({ error: 'Erreur serveur lors de la mise à jour.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Aucun utilisateur trouvé avec cet email.' });
      }

      return res.json({ message: 'Validation effectuée avec succès.' });
    });
  } else {
    return res.status(400).json({ error: 'Utilisez la route /compte/supprimer pour refuser un utilisateur.' });
  }
};

exports.deleteUser = (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email requis pour la suppression.' });
  }

  const sql = 'DELETE FROM authentification WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('Erreur lors de la suppression :', err);
      return res.status(500).json({ error: 'Erreur serveur lors de la suppression.' });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Aucun utilisateur trouvé avec cet email.' });
    }
    return res.json({ message: 'Utilisateur supprimé avec succès.' });
  });
};
