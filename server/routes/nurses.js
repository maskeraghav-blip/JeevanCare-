const express = require('express');
const router = express.Router();
const nurseController = require('../controllers/nurseController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', nurseController.getNurses);
router.get('/bookings', authMiddleware, nurseController.getBookings);
router.get('/:id', nurseController.getNurseById);
router.post('/:id/book', authMiddleware, nurseController.bookNurse);

module.exports = router;
