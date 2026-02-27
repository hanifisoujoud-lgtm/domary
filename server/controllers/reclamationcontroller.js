// controllers/reclamationController.js
const { createReclamation, getAllReclamations, deleteReclamation } = require("../model/reclamationmodel");

const addReclamation = (req, res) => {
  const { fullname, email, message } = req.body;

  // Validation
  if (!fullname || !email || !message) {
    return res.status(400).json({ message: "Nom complet, email et message sont requis." });
  }

  createReclamation({ fullname, email, message }, (err, id) => {
    if (err) {
      console.error("Erreur création réclamation:", err);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      message: "Réclamation envoyée avec succès",
      id,
      data: { fullname, email, message }
    });
  });
};

const getAllReclamationsController = (req, res) => {
  getAllReclamations((err, reclamations) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({
      message: "Réclamations récupérées",
      count: reclamations.length,
      data: reclamations
    });
  });
};

const deleteReclamationController = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

  deleteReclamation(id, (err, affectedRows) => {
    if (err) {
      if (err.message === "Réclamation non trouvée") return res.status(404).json({ message: "Réclamation non trouvée" });
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Réclamation supprimée avec succès" });
  });
};

module.exports = {
  addReclamation,
  getAllReclamationsController,
  deleteReclamationController
};