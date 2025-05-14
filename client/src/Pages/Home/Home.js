import React from 'react';
import Figure from 'react-bootstrap/Figure';
import dragonfly from "../../assets/images/dragonfly.jpg";
import lotus from "../../assets/images/lotusFlower.jpg"
import "./Home.css";

export default function Home() {
  return (
    <div>
      <h1 id="titleHome">My Road to Recovery</h1>

      <div>
      <Figure>
      <Figure.Image
        width={300}
        height={300}
        alt="171x180"
        src={dragonfly}
      />
      <Figure.Caption className="caps">
        Learn to free yourself from the restraints of addiction!
      </Figure.Caption>
    </Figure>
      </div>

      <div>
      <Figure>
      <Figure.Image
        width={300}
        height={300}
        alt="171x180"
        src={lotus}
      />
      <Figure.Caption className="caps">
        Nulla vitae elit libero, a pharetra augue mollis interdum.
      </Figure.Caption>
    </Figure>
      </div>

    </div>
  )
}
