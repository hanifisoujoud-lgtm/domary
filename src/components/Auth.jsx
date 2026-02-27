// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AuthForm = () => {
//   const navigate = useNavigate(); // 1️⃣ Hook to navigate
//   const [isLogin, setIsLogin] = useState(false);
//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });
//   const [message, setMessage] = useState("");

//   const handleToggle = () => {
//     setIsLogin(!isLogin);
//     setMessage("");
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("Loading...");

//     const url = isLogin
//       ? "http://localhost:5000/login"
//       : "http://localhost:5000/register";

//     const payload = isLogin
//       ? { email: formData.email, password: formData.password }
//       : formData;

//     try {
//       const res = await fetch(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setMessage(data.message);

//         if (data.token) {
//           localStorage.setItem("token", data.token);
//         }

//         // 2️⃣ Redirect if role is client
//         if (data.user && data.user.role === "client") {
//           navigate("/home");
//         }
//       } else {
//         setMessage(data.message || "Something went wrong");
//       }
//     } catch (err) {
//       setMessage("Server error");
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>{isLogin ? "Login" : "Register"}</h2>
//       <form onSubmit={handleSubmit}>
//         {!isLogin && (
//           <input
//             type="text"
//             name="name"
//             placeholder="Name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//           />
//         )}
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <button type="submit">{isLogin ? "Login" : "Register"}</button>
//       </form>
//       <p>
//         {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
//         <button onClick={handleToggle} className="toggle-btn">
//           {isLogin ? "Register here" : "Login here"}
//         </button>
//       </p>
//       <div className="message">{message}</div>
//     </div>
//   );
// };

// export default AuthForm;


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const navigate = useNavigate(); // 1️⃣ Hook to navigate
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Loading...");

    const url = isLogin
      ? "http://localhost:5000/login"
      : "http://localhost:5000/register";

    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : formData;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);

        if (data.token) {
          localStorage.setItem("token", data.token);
        }

        // 2️⃣ Redirect based on role
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
          if (data.user.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/home");
          }
        }
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (err) {
      setMessage("Server error");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Register"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isLogin ? "Login" : "Register"}</button>
      </form>
      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={handleToggle} className="toggle-btn">
          {isLogin ? "Register here" : "Login here"}
        </button>
      </p>
      <div className="message">{message}</div>
    </div>
  );
};

export default AuthForm;

