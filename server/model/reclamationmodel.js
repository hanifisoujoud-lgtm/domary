// model/reclamationModel.js
const db = require("../database.js");

const createReclamation = async (reclamation, callback) => {
  try {
    const sql = `INSERT INTO reclamations (fullname, email, message) VALUES (?, ?, ?)`;
    const values = [reclamation.fullname, reclamation.email, reclamation.message];
    const [result] = await db.query(sql, values);
    callback(null, result.insertId);
  } catch (err) {
    console.error("Erreur SQL:", err);
    callback(err);
  }
};

const getAllReclamations = async (callback) => {
  try {
    const sql = `SELECT id, fullname, email, message, created_at FROM reclamations ORDER BY created_at DESC`;
    const [rows] = await db.query(sql);
    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

const deleteReclamation = async (id, callback) => {
  try {
    const sql = `DELETE FROM reclamations WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    if (result.affectedRows === 0) return callback(new Error("Réclamation non trouvée"));
    callback(null, result.affectedRows);
  } catch (err) {
    callback(err);
  }
};

module.exports = {
  createReclamation,
  getAllReclamations,
  deleteReclamation
};