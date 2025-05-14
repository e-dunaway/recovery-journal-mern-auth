import React, { useState, useEffect, useContext } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../UserContext/UserContext";

const isAuthenticated = async () => {

  try {
    // Make a GET request to the server's authentication check endpoint
    const response = await axios.get("http://localhost:8080/auth/check", {
      withCredentials: true, // Include cookies with the request, important for sending the JWT stored in cookies
    });

    console.log(response.data.user)

    // Return true if the response status is 200 (OK), indicating authentication is valid

    // have piece of code that checks to see what we get from response.status, save in variable
    const resStatus = response.status === 200 ? true : false;
    const userObj = {
      isLogged: resStatus,
      user: response.data.user
    }
    // Create an object literal with a isLogged and a user property. Set the value of isLogged to variable, set user to response.user
    return userObj;
  } catch (error) {
    console.error(error);
    return false; // Return false if an error occurs, indicating authentication failure
  }
};


const PrivateRoutes = ({ element: Component }) => {
  const { user, setUser } = useContext(UserContext)
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      // What auth would store now is an object { isLogged: true, user: { username: Xxx, somethingEls: Xxx}}
      const auth = await isAuthenticated();
      // Check if the user is authenticated
      setIsAuth(auth.isLogged);
     if (auth) {
      setUser(auth.user)
     }      
    };
    checkAuth();// Call checkAuth when the component mounts
  }, [])
  // Empty dependency array ensures this effect runs only once after the component mounts

  if (isAuth === null) {
    return <div>Loading...</div>; 
    // Render a loading message while authentication status is being determined
  }  
    return isAuth ? <Component /> : <Navigate to="/form" />;
  };
    // If authenticated (isAuth is true), render the protected component
    // If not authenticated (isAuth is false), redirect to the login page

export default PrivateRoutes;
