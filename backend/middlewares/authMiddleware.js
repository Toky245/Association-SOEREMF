const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'secret_dev_token';

exports.authenticateUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Non authentifié.' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Token invalide.' });
  }
};
