import React, { useState } from 'react';
import axios from 'axios';
import Button from 'react-bootstrap/esm/Button';
import Form from "react-bootstrap/Form";
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import { useNavigate } from 'react-router-dom';

export default function RegisterUser() {
  const [userAccount, setUserAccount] = useState({
    username: "",
    password: "",
    entries: []
  });
  const [accountCreated, setAccountCreated] = useState(false);
  const navigate = useNavigate()

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post(`http://localhost:8080/users`, userAccount)
      .then((res) => {
        console.log("User has been registered:" + res.data)
        setAccountCreated(true)
        setUserAccount({
          username: "",
          password: "",
          entries: []
        })
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    setUserAccount({ ...userAccount, [e.target.username]: e.target.value })
  }
  
  return (
    <div>
      <h3>Register New User</h3>
      {accountCreated ? <p id="redAlert">
        Success! Please login to continue...
      </p> : null}
      <FloatingLabel
        controlId="floatingInput"
        label="Username"
        className="mb-3"
      >
        <Form.Control
          type="text" 
          placeholder="Your Username"
          onChange={handleChange} 
          name="username" />
      </FloatingLabel>

      <FloatingLabel
        controlId="floatingPassword"
        label="Password"
      >
        <Form.Control 
          type="password" 
          placeholder="Password" 
          onChange={handleChange}
          name="password" />
      </FloatingLabel>
      <br />
      <div>
        <Button variant="dark" onClick={handleRegister}>Register</Button>
        <br />
        {/* {isRegistered ? <h5>Registration successful!</h5> : null} */}
      </div>
    </div>
  )
}
