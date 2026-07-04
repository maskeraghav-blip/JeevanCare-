const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');

router.get('/', searchController.globalSearch);
router.post('/ai-assist', searchController.aiMapAssist);

module.exports = router;
