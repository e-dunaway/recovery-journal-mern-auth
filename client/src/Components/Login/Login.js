import React, { useState, useContext } from "react";
import axios from "axios";
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate } from "react-router-dom";
import UserContext from "../UserContext/UserContext";

function LoginForm() {
  const { user, setUser } = useContext(UserContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState(false)
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:8080/login",
        { username, password },
        { withCredentials: true }
      )
      .then((res) => {
        //this is setting the context to be shared across pages with the user information.
        console.log(res.data.user)
        setUser(res.data.user)
        // setIsActive(true)
        navigate("/form")
      })
     .catch((err) => {
      setError(true)
      console.error(err)
     })
  }

  const handleLogout = () => {
    axios
      .get(
        "http://localhost:8080/logout",
        { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        // setIsActive(false)
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      {/* <h2>Welcome {userInfo ? userInfo.username : "Please Register or Login to begin"}</h2> */}
      <h3>Login here:</h3>
      {error ? <p id="redAlert">User not registered, please register to continue!</p> : null}
      <FloatingLabel
        controlId="floatingInput1"
        label="Username"
        className="mb-3"
      >
        <Form.Control type="text" placeholder="username"
          value={username} onChange={(e) => setUsername(e.target.value)} name="username" />
      </FloatingLabel>

      <FloatingLabel
        controlId="floatingPassword1"
        label="Password"
      >
        <Form.Control onChange={(e) => setPassword(e.target.value)} value={password} name="password" type="password" placeholder="Password" />
      </FloatingLabel>

      <br />

      <div id="loginLogoutBtnsDiv">
        <Button variant="dark" onClick={handleLogin} type="submit">Login</Button>
        <br />
        <Button variant="dark" onClick={handleLogout}>Logout</Button>
        <br />
      </div>

      <br />
      {/* <span>{isActive ? <h5>Welcome back, {user.username}! </h5> : null}</span>
      <br />
      <span>{!isActive ? <h5>Successfully logged out</h5> : null}</span> */}
    </>
  );
}

export default LoginForm;