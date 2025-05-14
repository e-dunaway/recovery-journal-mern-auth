import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/esm/Button';
import "./Form.css";

// need to handle what happens if no user is logged in and entry is created (or if attempt made to create an entry without user logged in)
// figure out logout (where do I want that functionality?)

export default function InputForm() {
  const [user, setUser] = useState([]);
  const [sobrietyDate, setSobrietyDate] = useState(new Date().toLocaleDateString());
  const [entryDate, setEntryDate] = useState(new Date().toLocaleDateString());
  const [feeling, setFeeling] = useState("");
  const [cravingLevel, setCravingLevel] = useState(0);
  const [journalEntry, setJournalEntry] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/user", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data)
        setUser(res.data)
      })
      .catch((error) => console.log("Error fetching data", error));
  }, [])

  console.log(user)
  // console.log(username)

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      username: user.username,
      sobrietyDate: sobrietyDate,
      entryDate: entryDate,
      feeling: feeling,
      cravingLevel: cravingLevel,
      journalEntry: journalEntry
    }
    axios
      .post("http://localhost:8080/journal", data)
      .then((res) => {
        console.log(res.data);
        // setUser(user.map((e) => e.user === e.target.value))
      })
      .catch((err) => {
        console.log(err);
      })

    setSobrietyDate("")
    setEntryDate("")
    setFeeling("")
    setCravingLevel(0)
    setJournalEntry("")
    navigate("/list")
  }

  return (
    <div>
      <h1 id="formTitle">Create My Journal Entries</h1>

      <div id="formContainer">
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-sobrietyDate">
            Sobriety Date
          </InputGroup.Text>
          <Form.Control
            type="date"
            value={sobrietyDate}
            onChange={(e) => setSobrietyDate(e.target.value)}
            aria-label="Sobriety Date"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>
        <br />
        <InputGroup className="mb-3" >
          <InputGroup.Text id="inputGroup-sizing-entryDate">
            Entry Date
          </InputGroup.Text>
          <Form.Control
            type="date"
            value={entryDate}
            onChange={(e) => setEntryDate(e.target.value)}
            aria-label="Entry Date"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>
        <br />
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-feeling">
            Feeling
          </InputGroup.Text>
          <Form.Control
            type="text"
            value={feeling}
            onChange={(e) => setFeeling(e.target.value)}
            aria-label="feeling"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>
        <br />
        <InputGroup className="mb-3">
          <InputGroup.Text id="inputGroup-sizing-cravingLevel">
            Craving Level
          </InputGroup.Text>
          <Form.Control
            type="number"
            value={cravingLevel}
            onChange={(e) => setCravingLevel(e.target.value)}
            aria-label="Craving Level"
            aria-describedby="inputGroup-sizing-default"
          />
        </InputGroup>
        <br />
        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
          <Form.Label>Journal Entry:</Form.Label>
          <Form.Control as="textarea"
            rows={5}
            cols={50}
            value={journalEntry}
            onChange={(e) => setJournalEntry(e.target.value)}
          />
        </Form.Group>
        <br />
        <Button variant="dark" onClick={handleSubmit}>Create!</Button>
      </div>
    </div>
  )
}
