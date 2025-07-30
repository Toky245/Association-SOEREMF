const express = require('express');
const router = express.Router();
const depenseController = require('../controllers/depenseController');

router.get('/list', depenseController.getAllDepenses);
router.post('/create', depenseController.createDepense);

module.exports = router;
