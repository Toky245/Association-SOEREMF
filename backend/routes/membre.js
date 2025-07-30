const express = require('express');
const router = express.Router();
const membreController = require('../controllers/membreController');

router.get('/', membreController.getAllMembres);
router.post('/', membreController.createMembre);
router.get('/:id', membreController.getMembreById);
router.put('/:id', membreController.updateMembre);
router.delete('/:id', membreController.deleteMembre);

module.exports = router;
