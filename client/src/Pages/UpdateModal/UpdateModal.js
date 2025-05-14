import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import React, {useState} from 'react';
// import {useParams} from "react-router-dom";
import axios from "axios";

export default function UpdateModal({info}) { 
  // const [info, setInfo] = useState([{}]);
  const [show, setShow] = useState(false);
  const [description, setDescription] = useState(info.description)
  const [inputAmount, setInputAmount] = useState(info.amount);
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  // const { id } = useParams()

  const handleUpdate = () => { 
    // e.preventDefault();
    console.log("Submitted")
    const data = {
      description: description,
      inputAmount: inputAmount,
    }
    axios   
      .put(`http://localhost:8080/items/${info._id}`, data)
      .then((res) => {
        console.log(res.data)
        handleClose()
        window.location.reload()
    })
    .catch((err) => {
        console.log(err);
    });      
  }

   return (
    <>
    <Button onClick={handleShow}>Update Expense</Button>

    <Modal
      show={show} onHide={handleClose}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Transaction
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
         <label>Description: {" "}
          <input type="text" onChange={(e) => setDescription(e.target.value)} value={description} placeholder="Enter description" />
        </label>
        <br /><br />
        <label> Input Amount: $
          <input type="number" onChange={(e) => setInputAmount(e.target.value)} value={inputAmount} placeholder="Enter amount" />
        </label>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={handleClose}>Close</Button>
        <Button onClick={handleUpdate}>Update Transaction</Button>
      </Modal.Footer>
    </Modal>
    </>
  );
}