const db = require("../database.js");

const createBlog = async (blog, callback) => {
  try {
    const sql = `INSERT INTO blogs (title, content, image_url, author, status) VALUES (?, ?, ?, ?, ?)`;
    const values = [blog.title, blog.content, blog.image_url, blog.author, blog.status || 'published'];
    console.log("SQL:", sql, "Values:", values); // Debug
    const [result] = await db.query(sql, values);
    callback(null, result.insertId);
  } catch (err) {
    console.error("Erreur SQL:", err);
    callback(err);
  }
};

const getAllBlogs = async (callback) => {
  try {
    const sql = `SELECT id, title, content, image_url, author, status, created_at, updated_at FROM blogs ORDER BY created_at DESC`;
    const [rows] = await db.query(sql);
    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

const getBlogById = async (id, callback) => {
  try {
    const sql = `SELECT id, title, content, image_url, author, status, created_at, updated_at FROM blogs WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    if (rows.length === 0) return callback(new Error("Blog non trouvé"));
    callback(null, rows[0]);
  } catch (err) {
    callback(err);
  }
};

const updateBlog = async (id, blog, callback) => {
  try {
    const sql = `UPDATE blogs SET title = ?, content = ?, image_url = ?, author = ?, status = ? WHERE id = ?`;
    const values = [blog.title, blog.content, blog.image_url, blog.author, blog.status, id];
    console.log("Update SQL:", sql, "Values:", values); // Debug
    const [result] = await db.query(sql, values);
    if (result.affectedRows === 0) return callback(new Error("Blog non trouvé"));
    callback(null, result.affectedRows);
  } catch (err) {
    console.error("Erreur SQL Update:", err);
    callback(err);
  }
};

const deleteBlog = async (id, callback) => {
  try {
    const sql = `DELETE FROM blogs WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    if (result.affectedRows === 0) return callback(new Error("Blog non trouvé"));
    callback(null, result.affectedRows);
  } catch (err) {
    callback(err);
  }
};

const getBlogsByStatus = async (status, callback) => {
  try {
    const sql = `SELECT id, title, content, image_url, author, status, created_at, updated_at FROM blogs WHERE status = ? ORDER BY created_at DESC`;
    const [rows] = await db.query(sql, [status]);
    callback(null, rows);
  } catch (err) {
    callback(err);
  }
};

module.exports = { 
  createBlog, 
  getAllBlogs, 
  getBlogById, 
  updateBlog, 
  deleteBlog, 
  getBlogsByStatus 
};