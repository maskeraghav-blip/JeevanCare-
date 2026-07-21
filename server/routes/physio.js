const express = require('express');
const router = express.Router();
const physioController = require('../controllers/physioController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', physioController.getPhysiotherapists);
router.get('/appointments', authMiddleware, physioController.getAppointments);
router.get('/:id', physioController.getPhysiotherapistById);
router.post('/:id/book', authMiddleware, physioController.bookHomeVisit);

module.exports = router;
