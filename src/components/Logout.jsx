import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  React.useEffect(() => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  }, []);

  return null;
};

export default Logout;
