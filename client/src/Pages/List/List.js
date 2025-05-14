import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/esm/Button';
import "./List.css";

export default function List() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/journal`)
      .then((res) => {
        setEntries(res.data)
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(("http://localhost:8080/user"),
        {
          withCredentials: true,
        })
      .then((res) => {
        console.log(res.data)
        setUserData(res.data)
      })
      .catch((err) => {
        console.log("Error fetching data:", err)
      })
  }, []);

  // console.log(userData)

  const handleUpdate = (id) => {
    navigate(`/list/${id}`)
  }

  const handleDelete = (e) => {
    window.location.reload();
    axios
      .delete(`http://localhost:8080/journal/${e.target.value}`)
      .then((res) => {
        console.log("Journal deleted: " + res.data)
        setUserData(userData.filter((entry) => entry._id !== e.target.value))
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const changeDate = (e) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = new Date(e);
    let month = months[date.getMonth()]
    let day = date.getDate() + 1;
    let year = date.getFullYear()
    return month + " " + day + ", " + year
  }

  return (
    <div>
      {/* <h1 id="listTitle">View Your Journal</h1> */}
      <h1 id="userWelcome">Welcome, {userData.username}</h1>

      <div id="listContainer">
        {entries.map((item) => {
          if (userData.username === item.userData) {
            return (
              <div id="cardDiv" key={item._id}>
                <Row xs={1} md={3} className="g-4">
                  {Array.from(item[0]).map((e, idx) => (
                    <Col key={idx}>
                      <Card id="card">
                        <Card.Body>
                          <Card.Title>{changeDate(item.entryDate)}</Card.Title>

                          <Card.Text>
                            Sobriety Date: {changeDate(item.sobrietyDate)}
                          </Card.Text>
                          <Card.Text>
                            Feeling: {item.feeling}
                          </Card.Text>
                          <Card.Text>
                            Craving Level: {item.cravingLevel}
                          </Card.Text>
                          <Card.Text>
                            Journal Entry: {item.journalEntry}
                          </Card.Text>

                        </Card.Body>

                        <div id="updateAndDeleteBtnsDiv">
                          <Button
                            variant="dark"
                            id="updateBtn"
                            onClick={() => handleUpdate(item._id)}
                          >Update</Button>
                          <br />
                          <Button
                            variant="dark"
                            id="deleteBtn"
                            value={item._id}
                            onClick={handleDelete}
                          >Delete</Button>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </div>
            )
          } else {
            return ""
          }
        })}

      </div>
      <Button id="goToFormBtn" onClick={() => navigate('/form')}>Add Entry</Button>
    </div>
  )
};
