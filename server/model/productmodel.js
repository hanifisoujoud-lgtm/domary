const db = require("../database.js");

const createProduct = async (product, callback) => {
  try {
    const sql = `INSERT INTO products (category, nom, photo, description) VALUES (?, ?, ?, ?)`;
    const values = [product.category, product.nom, product.photo, product.description];
    const [result] = await db.query(sql, values);
    callback(null, result.insertId);
  } catch (err) {
    callback(err);
  }
};

const getProducts = async (callback) => {
  try {
    const sql = `SELECT id, category, nom, photo, description, created_at FROM products ORDER BY created_at DESC`;
    const [rows] = await db.query(sql);
    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

const getProductsByCategory = async (category, callback) => {
  try {
    const sql = `SELECT id, category, nom, photo, description, created_at FROM products WHERE category = ? ORDER BY created_at DESC`;
    const [rows] = await db.query(sql, [category]);
    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

const getProductById = async (id, callback) => {
  try {
    const sql = `SELECT id, category, nom, photo, description, created_at FROM products WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    if (rows.length === 0) return callback(new Error("Produit non trouvé"));
    callback(null, rows[0]);
  } catch (err) {
    callback(err);
  }
};

const deleteProduct = async (id, callback) => {
  try {
    const sql = `DELETE FROM products WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    if (result.affectedRows === 0) return callback(new Error("Produit non trouvé"));
    callback(null, result.affectedRows);
  } catch (err) {
    callback(err);
  }
};

module.exports = { createProduct, getProducts, getProductsByCategory, getProductById , deleteProduct };
