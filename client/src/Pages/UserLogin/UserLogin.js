import React, {useContext} from 'react';
import RegisterUser from '../../Components/RegisterUser/RegisterUser';
import LoginForm from "../../Components/Login/Login";
import { useNavigate } from "react-router-dom";
import Button from 'react-bootstrap/esm/Button';
// import UserContext from '../../Components/UserContext/UserContext';
import "./UserLogin.css";


export default function UserLogin() {
  // const {user, SetUser} = useContext(UserContext)
  const navigate = useNavigate();

  return (
    <div>
      <h1 id="mainTitle">Recovery Journal</h1>
      <br />
      <div id="loginContainer">
      <div id="regDiv">
      <RegisterUser />
      </div>
      <br/>
      <hr />
      <br />
      
      <div id="loginDiv">
      <LoginForm />
      </div>
      <br />
      <div id="fromFormBtnsDiv">
        <Button variant="light" onClick={() => navigate("/form")} type="submit">Create Entry</Button>
        <Button variant="light" onClick={() => navigate("/list")} type="submit">
          My Journal
        </Button>
        <br />
        {/* {isActive ? <h5>Welcome back, {username}! </h5> : null} */}
      </div>
      </div>
    </div>
  )
}
