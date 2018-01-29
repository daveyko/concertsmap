import React from 'react'
require('react-bootstrap-modal/lib/css/rbm-complete.css')
const Modal = require('react-bootstrap-modal')

const LoadingPage = (props) => {
  return (
    <div>
    <Modal
style = {{marginTop:
    '230px'}} show = {props.loadingModal} onHide = {props.toggleModal('loadingModal')} aria-labelledby="ModalHeader" >
      <Modal.Header />
          <Modal.Body>
            <div className = "sign-in-wrapper">
            {!props.errorMessage ? <div className = "loader" /> : <p>{props.errorMessage}</p>}
            </div>
          </Modal.Body>
      <Modal.Footer />
    </Modal>
    </div>
  )

}

export default LoadingPage
