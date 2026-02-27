const db = require("../database.js");

const createReservation = async (reservation, callback) => {
  try {
    const sql = `INSERT INTO reservations (product_id, client_nom, client_telephone, type_reservation) VALUES (?, ?, ?, ?)`;
    const values = [reservation.product_id, reservation.client_nom, reservation.client_telephone, reservation.type_reservation];
    const [result] = await db.query(sql, values);
    callback(null, result.insertId);
  } catch (err) {
    callback(err);
  }
};

const getAllReservations = async (callback) => {
  try {
    const sql = `
      SELECT 
        r.id, 
        r.product_id, 
        r.client_nom, 
        r.client_telephone, 
        r.type_reservation, 
        r.created_at,
        p.nom as product_nom,
        p.category as product_category
      FROM reservations r 
      LEFT JOIN products p ON r.product_id = p.id 
      ORDER BY r.created_at DESC
    `;
    const [rows] = await db.query(sql);
    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

const getReservationsByType = async (type, callback) => {
  try {
    const sql = `
      SELECT 
        r.id, 
        r.product_id, 
        r.client_nom, 
        r.client_telephone, 
        r.type_reservation, 
        r.created_at,
        p.nom as product_nom,
        p.category as product_category
      FROM reservations r 
      LEFT JOIN products p ON r.product_id = p.id 
      WHERE r.type_reservation = ?
      ORDER BY r.created_at DESC
    `;
    const [rows] = await db.query(sql, [type]);
    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

const deleteReservation = async (id, callback) => {
  try {
    const sql = `DELETE FROM reservations WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    if (result.affectedRows === 0) return callback(new Error("Réservation non trouvée"));
    callback(null, result.affectedRows);
  } catch (err) {
    callback(err);
  }
};

module.exports = { createReservation, getAllReservations, getReservationsByType, deleteReservation };