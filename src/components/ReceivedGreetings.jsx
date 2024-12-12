import React, { useEffect, useState } from "react";

function ReceivedGreetings({ user }) {
  const [greetings, setGreetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchGreetings() {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `/.netlify/functions/getMessages?recipient=${user.name}`,
          {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch greetings.");
        }

        setGreetings(data.messages || []);
      } catch (err) {
        setError(err.message || "An error occurred while fetching greetings.");
      } finally {
        setLoading(false);
      }
    }

    fetchGreetings();
  }, [user.name]);

  return (
    <div>
      <h2>Received Greetings</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <ul>
          {greetings.map((greeting, index) => (
            <li key={index}>
              <p><strong>From:</strong> {greeting.sender}</p>
              <p><strong>Message:</strong> {greeting.greeting}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReceivedGreetings;
