// routes/reclamationRoutes.js
const express = require("express");
const {
  addReclamation,
  getAllReclamationsController,
  deleteReclamationController
} = require("../controllers/reclamationcontroller");

const router = express.Router();

router.post("/reclamations", addReclamation);
router.get("/reclamations", getAllReclamationsController);
router.delete("/reclamations/:id", deleteReclamationController);

module.exports = router;