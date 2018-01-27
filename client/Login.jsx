import React from 'react'
require('react-bootstrap-modal/lib/css/rbm-complete.css')
const Modal = require('react-bootstrap-modal')

const ModalComponent = (props) => {
  return (
    <div>
    <Modal show = {props.modal} onHide = {props.toggleModal('modal')} aria-labelledby="ModalHeader" >
      <Modal.Header />
          <Modal.Body>
            <div className = "sign-in-wrapper">
            <h1>Login</h1>
            <a className = "spotify-login" href = "/api/spotify">
              <p className = "spotify-login-text">Sign in with Spotify <i className="fa fa-spotify" aria-hidden="true" /></p>
            </a>
            </div>
          </Modal.Body>
      <Modal.Footer>
        <Modal.Dismiss>Cancel</Modal.Dismiss>
      </Modal.Footer>
    </Modal>
    </div>
  )

}


export default ModalComponent
