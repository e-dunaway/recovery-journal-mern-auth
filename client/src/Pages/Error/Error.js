import React from 'react';
import Image from 'react-bootstrap/Image';
import errorPic from "../../assets/images/lonelyRoad.png";
import "./Error.css"

export default function Error() {
  return (
    <div id="mainErrorDiv">
      
      <h1>Oopsie!</h1>
      <Image id="errorPic" src={errorPic} roundedCircle />
      <h3>You have chosen the wrong path! Turn back!</h3>

    </div>
  )
}
