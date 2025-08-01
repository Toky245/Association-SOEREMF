const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_token';

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: 'Email et mot de passe requis.' });

  const sql = 'SELECT * FROM authentification WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Erreur serveur.' });
    if (results.length === 0) return res.status(401).json({ error: 'Utilisateur non trouvé.' });

    const user = results[0];
    const isPasswordValid = await bcrypt.compare(password, user.mdp);
    if (!isPasswordValid) return res.status(401).json({ error: 'Mot de passe incorrect.' });
    if (!user.valide) return res.status(403).json({ error: 'Compte non validé.' });

   
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    }, JWT_SECRET, { expiresIn: '7d' });

 
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'false',
      sameSite: 'None',
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.json({ message: 'Connexion réussie' });
  });
};

exports.getProfile = (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'Utilisateur non authentifié.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const sql = `
      SELECT id, nom, email, role, promotion, date_creation
      FROM authentification
      WHERE id = ?
    `;

    db.query(sql, [userId], (err, results) => {
      if (err) {
        console.error('Erreur BDD:', err);
        return res.status(500).json({ error: 'Erreur serveur' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const user = results[0];

      return res.json({
        user: {
          id: user.id,
          nom: user.nom,
          email: user.email,
          role: user.role,
          promotion: user.promotion,
          dateInscription: user.date_creation,
        }
      });
    });
  } catch (err) {
    return res.status(401).json({ error: 'Token invalide' });
  }
};

