const { createReservation, getAllReservations, getReservationsByType, deleteReservation } = require("../model/reservationmodel");

const addNewReservation = (req, res) => {
  const { product_id, client_nom, client_telephone, type_reservation } = req.body;

  // Validation
  if (!product_id || !client_nom || !client_telephone || !type_reservation) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  if (!['acheter', 'louer'].includes(type_reservation)) {
    return res.status(400).json({ message: "Type de réservation invalide. Utilisez 'acheter' ou 'louer'." });
  }

  // Validation téléphone (simple)
  const phoneRegex = /^[0-9\s\-\+\(\)]{8,20}$/;
  if (!phoneRegex.test(client_telephone)) {
    return res.status(400).json({ message: "Numéro de téléphone invalide." });
  }

  createReservation({ product_id, client_nom, client_telephone, type_reservation }, (err, id) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      message: `Réservation ${type_reservation} créée avec succès`, 
      id,
      data: { product_id, client_nom, client_telephone, type_reservation }
    });
  });
};

const getAllReservationsController = (req, res) => {
  getAllReservations((err, reservations) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ 
      message: "Réservations récupérées", 
      count: reservations.length, 
      data: reservations 
    });
  });
};

const getReservationsByTypeController = (req, res) => {
  const { type } = req.params;
  
  if (!['acheter', 'louer'].includes(type)) {
    return res.status(400).json({ message: "Type invalide. Utilisez 'acheter' ou 'louer'." });
  }

  getReservationsByType(type, (err, reservations) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ 
      message: `Réservations ${type} récupérées`, 
      count: reservations.length, 
      data: reservations 
    });
  });
};

const deleteReservationController = (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ message: "ID invalide" });

  deleteReservation(id, (err, affectedRows) => {
    if (err) {
      if (err.message === "Réservation non trouvée") return res.status(404).json({ message: "Réservation non trouvée" });
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json({ message: "Réservation supprimée avec succès" });
  });
};

module.exports = { 
  addNewReservation, 
  getAllReservationsController, 
  getReservationsByTypeController, 
  deleteReservationController 
};