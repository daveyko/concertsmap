import React from 'react'
require('react-bootstrap-modal/lib/css/rbm-complete.css')
const Modal = require('react-bootstrap-modal')

const ModalComponent = (props) => {
  return (
    <div>
    <Modal show = {props.modal} onHide = {props.toggleModal} aria-labelledby="ModalHeader" >
      <Modal.Header />
          <Modal.Body>
            <h1>Login</h1>
            <a href = "/api/spotify">
              <i className="fa fa-spotify" aria-hidden="true" />
            </a>
          </Modal.Body>
      <Modal.Footer>
        <Modal.Dismiss>Cancel</Modal.Dismiss>
      </Modal.Footer>
    </Modal>
    </div>
  )

}


export default ModalComponent
