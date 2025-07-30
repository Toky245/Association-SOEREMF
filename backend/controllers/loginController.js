const bcrypt = require('bcrypt'); 
const db = require('../db');

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe sont requis.' });
  }

  const sql = 'SELECT * FROM authentification WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Erreur BDD:', err);
      return res.status(500).json({ error: 'Erreur serveur.' });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: 'Utilisateur non trouvé.' });
    }

    const user = results[0];

    const isPasswordValid = await bcrypt.compare(password, user.mdp);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Mot de passe incorrect.' });
    }

    // Ici, tu peux générer un token JWT ou une session (optionnel)
    // Pour l'instant, on renvoie juste une réponse simple

    return res.json({
      message: 'Connexion réussie',
      userId: user.id,
      email: user.email,
      role: user.role,
    });
  });
};
