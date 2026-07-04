const express = require('express');
const router = express.Router();
const consentController = require('../controllers/consentController');
const { authMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, consentController.submitConsent);
router.get('/', authMiddleware, consentController.getConsents);
router.get('/:id', authMiddleware, consentController.getConsentById);

module.exports = router;
