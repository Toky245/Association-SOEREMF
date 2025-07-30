const express = require('express');
const router = express.Router();
const tresorerieController = require('../controllers/tresorerieController');

router.get('/list', tresorerieController.getAllRevenus);
router.post('/create', tresorerieController.createRevenu);

module.exports = router;
