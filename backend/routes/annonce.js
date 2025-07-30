const express = require('express');
const router = express.Router();
const annonceController = require('../controllers/annonceController');


router.get('/list', annonceController.getAllAnnonces);
router.post('/create', annonceController.createAnnonce);
router.delete('/:id', annonceController.deleteAnnonceById);

module.exports = router;
