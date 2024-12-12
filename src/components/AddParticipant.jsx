import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddParticipant() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const onSwitchToLogin = () => {
    navigate('/login');
  }

  const handleRegister = async () => {
    if (!name || !password) {
      setResponseMessage("Please provide both name and password.");
      return;
    }

    try {
      const response = await fetch("/.netlify/functions/registerParticipant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to register participant.");
      }

      setResponseMessage(data.message);
      setName("");
      setPassword("");
      navigate('/login');
    } catch (error) {
      setResponseMessage(error.message);
    }
  };

  return (
    <div>
      <h2>Register</h2>
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
      <button onClick={handleRegister}>Register</button>
      <button onClick={onSwitchToLogin}>Log in</button>
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default AddParticipant;
