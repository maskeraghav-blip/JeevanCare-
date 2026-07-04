const express = require('express');
const router = express.Router();
const complaintController = require('../controllers/complaintController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');

router.post('/', optionalAuth, complaintController.submitComplaint);
router.get('/', authMiddleware, complaintController.getComplaints);

module.exports = router;
