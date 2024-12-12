import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";

function Dashboard() {
  const { user } = useContext(UserContext);
  const [greeting, setGreeting] = useState("");
  const [recipient, setRecipient] = useState(null);
  const [users, setUsers] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const onLogout = () => {
    navigate("/logout");
  };

  // Fetch all registered users
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await fetch("/.netlify/functions/getUsers", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        setUsers(data.users || []);
        assignRecipient(data.users || []);
      } catch (err) {
        setError(err.message || "An error occurred while fetching users.");
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, [setLoading, setError]);

  // Assign a unique recipient
  const assignRecipient = (usersList) => {
    if (usersList.length > 0) {
      const availableRecipients = usersList.filter(
        (u) => u.name !== user.name && !u.assignedTo,
      );
      if (availableRecipients.length > 0) {
        const randomIndex = Math.floor(
          Math.random() * availableRecipients.length,
        );
        setRecipient(availableRecipients[randomIndex].name);
      } else {
        setRecipient("No more recipients available.");
      }
    }
  };

  // Handle sending greeting
  const handleSendGreeting = async () => {
    if (!greeting) {
      setResponseMessage("Please enter a greeting.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/.netlify/functions/sendGreeting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          sender: user.name,
          recipient,
          greeting,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send greeting.");
      }

      setResponseMessage("Greeting sent successfully!");
      setGreeting("");
      assignRecipient(users);
    } catch (error) {
      setResponseMessage(error.message);
    }
  };

  // Navigate to Received Greetings page
  const handleViewReceivedGreetings = () => {
    const today = new Date();
    const restrictionDate = new Date("2024-12-12");
    if (today < restrictionDate) {
      setResponseMessage(
        "You cannot view received greetings until December 12, 2024.",
      );
    } else {
      navigate("/received-greetings");
    }
  };

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <button onClick={onLogout}>Log out</button>
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <>
          <p>
            Your recipient: <strong>{recipient}</strong>
          </p>
          <textarea
            placeholder="Enter your greeting"
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
          />
          <button onClick={handleSendGreeting}>Send Greeting</button>
          <button onClick={handleViewReceivedGreetings}>
            Received Greetings
          </button>
        </>
      )}
      {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
}

export default Dashboard;
