import UserContext from "./UserContext";
import { useState } from "react";

export default function UserProvider({ children }) {
  const [user, setUser] = useState({username:""});
  return(
    <UserContext.Provider value = {{user, setUser}}>
        {children}
    </UserContext.Provider>
  )
}
