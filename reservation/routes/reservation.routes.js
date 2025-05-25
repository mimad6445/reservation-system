const express = require('express');
const router = express.Router();
const { createReservation, cancelReservation , completeReservation , getMyReservations} = require('../controller/reservation.controller');
const auth = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { reservationSchema } = require('../utils/validator');

router.post('/mine', getMyReservations);
router.post('/', createReservation);
router.delete('/:id', cancelReservation);
router.patch('/:id/complete', auth, completeReservation);

module.exports = router;