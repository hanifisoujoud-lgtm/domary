const authmodel = require('../model/authmodel.js');

// REGISTER CONTROLLER
exports.registercontroller = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Missing required fields"
    });
  }

  try {
    const user = await authmodel.registerModel(name, email, password);

    return res.status(200).json({
      status: "success",
      message: "User registered successfully",
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    return res.status(500).json({
      status: "error",
      message: err.message.includes("exists") ? err.message : "Registration failed"
    });
  }
};

// LOGIN CONTROLLER
exports.logincontroller = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({
      status: "error",
      message: "Email and password are required"
    });
  }

  try {
    const result = await authmodel.loginModel(email, password);

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      token: result.token,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      }
    });
  } catch (err) {
    console.error("Login controller error:", err.message);
    return res.status(401).json({
      status: "error",
      message: err.message.includes("password") || err.message.includes("User") ? err.message : "Login failed"
    });
  }
};
