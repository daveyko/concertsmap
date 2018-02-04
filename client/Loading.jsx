import React from 'react'
require('react-bootstrap-modal/lib/css/rbm-complete.css')
const Modal = require('react-bootstrap-modal')

const LoadingPage = (props) => {
  return (
    <div>
    <Modal style = {{marginTop: '230px'}} show = {props.loadingModal} onHide = {props.toggleModal} aria-labelledby="ModalHeader" >
      <Modal.Header />
          <Modal.Body>
            <div className = "sign-in-wrapper">
            {!props.errorMessage ?
              <div>
              <div className = "loader" />
              {props.percentageComplete === props.percentageComplete ? <p className = "percent-loaded">{`${Math.floor(props.percentageComplete * 100) > 100 ? 100 : Math.floor(props.percentageComplete * 100) }%`}</p> : <div />}
              </div>
            : <p>{props.errorMessage}</p>}
            </div>
          </Modal.Body>
      <Modal.Footer />
    </Modal>
    </div>
  )

}

export default LoadingPage
