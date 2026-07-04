const express = require('express');
const router = express.Router();
const clinicDoctorController = require('../controllers/clinicDoctorController');
const { authMiddleware } = require('../middleware/auth');

router.get('/', clinicDoctorController.getClinicDoctors);
router.get('/appointments', authMiddleware, clinicDoctorController.getAppointments);
router.get('/:id', clinicDoctorController.getClinicDoctorById);
router.post('/:id/book', authMiddleware, clinicDoctorController.bookHomeVisit);

module.exports = router;
