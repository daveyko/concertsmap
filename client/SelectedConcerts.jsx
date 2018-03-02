import React from 'react'
import DropdownContainer from './utils/DropdownContainer.jsx'

const SelectedConcerts = (props) => {
    return (
      <div className="panel" id="selected-concerts">
        <div>
          <h2>Filter By</h2>
          <div className = "filter">
          {props.selectedConcerts.length ?
            <DropdownContainer display = "filter by" items = {['popularity']} onClick = {props.sortSelectedConcerts} /> : null}
          </div>
        </div>
        <div>
          <h2>Selected Concerts</h2>
          {props.startDate ?
            <div className = "filter-button">
              <div className = "button-wrapper">
                <div className = "button-select">
                  <div className = "text" onClick = {props.selectAllConcerts}>select all</div>
                </div>
                </div>
                <div className = "button-wrapper">
                <div className = "button-select">
                  <div className = "text" onClick = {props.removeAllConcerts} >remove all</div>
                </div>
              </div>
            </div> : null }
        </div>
        {props.selectedConcerts.map(selectedConcert => {
          let firstConcertWithImage = selectedConcert.performance.filter(performanceObj => {
            return performanceObj.image !== ''
          })
          let imageSrc = firstConcertWithImage.length ? firstConcertWithImage[0].image : '/not-found.png'
          return (
          <article className = "concert-wrapper">
            <button
              onClick = {() => {
              props.removeConcert(selectedConcert)}} id = "x">X</button>
            <div className = "popularity">{(selectedConcert.popularity * 1000).toFixed(2)}</div>
            <img className = "band-image" src = {imageSrc} alt = "image not found" />
            <div key = {selectedConcert.displayName} className = "selected-concert">
            <a href = {selectedConcert.uri}>{selectedConcert.displayName.slice(0, selectedConcert.displayName.indexOf('('))}</a>
            </div>
         </article>
          )
        })}
    </div>
    )
}


export default SelectedConcerts
