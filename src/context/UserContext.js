import { createContext } from "react";

export const UserContext = createContext({
  user: null,
  userLoaded: false,
  setUser: (_) => {},
});
