const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_token';

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

    if (!user.valide) {
      return res.status(403).json({ error: 'Compte non validé.' });
    }

        // Génération du token JWT
    const token = jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    }, JWT_SECRET, { expiresIn: '7d' });

    
    res.clearCookie('token');

   
    res.cookie('token', token, {
      httpOnly: true,
      secure: false, 
      sameSite: 'Lax', 
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    });


    return res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        valide: user.valide,
      }
    });
  });
};

exports.register = async (req, res) => {
  const { nom, email, promotion, password, confirmPassword, role } = req.body;

  if (!nom || !email || !promotion || !password || !confirmPassword) {
    return res.status(400).json({ error: 'Tous les champs sont requis.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Les mots de passe ne correspondent pas.' });
  }

  try {
    const [existingUser] = await new Promise((resolve, reject) => {
      db.query('SELECT * FROM authentification WHERE email = ?', [email], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Cet email est déjà utilisé.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO authentification (nom, email, promotion, mdp, role, valide)
      VALUES (?, ?, ?, ?, ?, false)
    `;
    db.query(sql, [nom, email, promotion, hashedPassword, role || 'Membre simple'], (err, result) => {
      if (err) {
        console.error('Erreur lors de l\'inscription :', err);
        return res.status(500).json({ error: 'Erreur serveur.' });
      }

      return res.status(201).json({ message: 'Inscription réussie', userId: result.insertId });
    });
  } catch (error) {
    console.error('Erreur inscription:', error);
    return res.status(500).json({ error: 'Erreur serveur.' });
  }
};
