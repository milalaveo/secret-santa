import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";

function Login() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const onSwitchToRegister = () => {
    navigate("/register");
  };

  const handleLogin = async () => {
    if (!name || !password) {
      setResponseMessage("Please provide both name and password.");
      return;
    }

    try {
      const response = await fetch("/.netlify/functions/loginParticipant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to log in.");
      }

      // Сохранение токена в localStorage
      localStorage.setItem("token", data.token);

      setResponseMessage("Login successful!");
      setName("");
      setPassword("");
      setUser(data.user); // Передача информации о пользователе
      navigate("/dashboard");
    } catch (error) {
      setResponseMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Log In</h2>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Log in</button>
      <button onClick={onSwitchToRegister}>Register</button>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default Login;
