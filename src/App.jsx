import React, { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AddParticipant from "./components/AddParticipant";
import Dashboard from "./components/Dashboard";
import ReceivedGreetings from "./components/ReceivedGreetings";
import { UserContext } from "./context/UserContext.js";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Login from "./components/Login.jsx";
import Logout from "./components/Logout.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [userLoaded, setUserLoaded] = useState(false);

  React.useEffect(() => {
    const handler = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUserLoaded(true);
        return;
      }

      const response = await fetch("/.netlify/functions/getUser", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        setUserLoaded(true);
        return;
      }

      try {
        const data = await response.json();

        setUser(data.user);
      } catch (e) {
        console.error(e);
      } finally {
        setUserLoaded(true);
      }
    };

    handler();
  }, [setUserLoaded, setUser]);

  return (
    <UserContext.Provider value={{ user, userLoaded, setUser }}>
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/received-greetings" element={<ReceivedGreetings />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Route>
          <Route path="/register" Component={AddParticipant} />
          <Route path="/login" Component={Login} />
          <Route path="/logout" Component={Logout} />
          {/*<Route path="/" element={<Navigate to="/login" replace />} />*/}
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
