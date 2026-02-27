const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../database.js"); // mysql2/promise connection
const privateKey = "this my secret key hahahahahahahahahahahaha";

// Register
exports.registerModel = async (name, email, password) => {
  try {
    const [existing] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (existing.length > 0) {
      throw new Error("User already exists !!!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    return {
      id: result.insertId,
      name,
      email,
      role: "client",
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

// Login
exports.loginModel = async (email, password) => {
  try {
    const [rows] = await db.execute("SELECT * FROM users WHERE email = ?", [email]);
    const user = rows[0];

    if (!user) throw new Error("Undefined User !!!");

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new Error("Wrong password !!!");

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      privateKey,
      { expiresIn: "1d" }
    );

    return { token, user };
  } catch (err) {
    throw new Error(err.message);
  }
};
