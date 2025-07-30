const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const authenticateController = require('../controllers/authenticateController');
const authMiddleware = require('../middlewares/authMiddleware');


router.get('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  res.json({ message: 'Déconnexion réussie' });
});
router.post('/login', loginController.login);
router.post('/register', loginController.register); 
router.get('/me', authMiddleware.authenticateUser, authenticateController.getProfile);
module.exports = router;
