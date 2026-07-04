const express = require('express');
const router = express.Router();
const hospitalController = require('../controllers/hospitalController');
const { authMiddleware } = require('../middleware/auth');

router.get('/appointments/history', authMiddleware, hospitalController.getAppointments);
router.get('/', hospitalController.getHospitals);
router.get('/:id', hospitalController.getHospitalById);
router.get('/:id/doctors', hospitalController.getHospitalDoctors);
router.get('/doctors/:doctorId', hospitalController.getDoctorById);
router.post('/:id/book', authMiddleware, hospitalController.bookHospitalAppointment);

module.exports = router;
