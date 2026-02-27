const express = require("express");
const {
  addNewReservation,
  getAllReservationsController,
  getReservationsByTypeController,
  deleteReservationController
} = require("../controllers/reservationcontroller");

const router = express.Router();

router.post("/reservations", addNewReservation);
router.get("/reservations", getAllReservationsController);
router.get("/reservations/type/:type", getReservationsByTypeController);
router.delete("/reservations/:id", deleteReservationController);

module.exports = router;