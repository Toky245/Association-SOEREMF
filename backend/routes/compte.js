const express = require('express');
const router = express.Router();
const compteController = require('../controllers/compteController');

router.get('/comptes', compteController.getAllUsers);
router.post('/valider', compteController.updateValidationAndRole);
router.post('/supprimer', compteController.deleteUser);
module.exports = router;
