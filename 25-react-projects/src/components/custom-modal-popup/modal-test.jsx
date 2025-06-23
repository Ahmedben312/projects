import { useState } from "react";
import Modal from "./modal";
import "./modal.css";

export default function ModalTest() {
  const [showModalPopup, setModalPopup] = useState(false);

  function toggleModalPopup() {
    setModalPopup(!showModalPopup);
  }
  function onClose() {
    setModalPopup(false);
  }
  return (
    <div>
      <button onClick={toggleModalPopup}>Open Modal Popup</button>
      {showModalPopup && (
        <Modal
          id={"custom-id"}
          header={<h1>Customized Header</h1>}
          footer={<h1>Customized Footer</h1>}
          onClose={onClose}
          body={<div>customize body</div>}
        />
      )}
    </div>
  );
}
