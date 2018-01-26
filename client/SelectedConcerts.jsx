import React, {Component} from 'react'

export default class SelectedConcerts extends Component{


  constructor(props){

      super(props)
      this.state = {
        filterSelected: null
      }
      this.handleFilter = this.handleFilter.bind(this)
  }

  handleFilter(e){
    this.setState({
      filterSelected: e.target.value
    })
  }


  render(){
    console.log('SELECTEDCONCERTSRENDER!', this.props.selectedConcerts)
    return (
      <div className="panel" id="selected-concerts">
        <div>
          <h2>Filter By</h2>
          <div className = "filter">
            <select id="filter" onChange = {this.handleFilter}>
              <option>Choose Filter</option>
              <option value = "popularity">Popularity</option>
            </select>
            <button onClick = { () => {
              if (this.state.filterSelected) this.props.sortSelectedConcerts()}}>filter</button>
          </div>
        </div>
        <div>
          <h2>Selected Concerts</h2>
            <div className = "filter">
              <button onClick = {this.props.selectAllConcerts}>Select All</button>
              <button onClick = {this.props.removeAllConcerts}>Remove All</button>
            </div>
        </div>
        {this.props.selectedConcerts.map(selectedConcert => {
          let firstConcertWithImage = selectedConcert.performance.filter(performanceObj => {
            return performanceObj.image !== ''
          })
          let imageSrc = firstConcertWithImage.length ? firstConcertWithImage[0].image : '/not-found.png'
          return (
          <article className = "concert-wrapper">
            <button
              onClick = {() => {
              this.props.removeConcert(selectedConcert)}} id = "x">X</button>
            <img className = "band-image" src = {imageSrc} alt = "image not found" />
            <div key = {selectedConcert.displayName} className = "selected-concert">
            <a href = {selectedConcert.uri}>{selectedConcert.displayName.slice(0, selectedConcert.displayName.indexOf('('))}</a>
              <p>{selectedConcert.popularity}</p>
            </div>
         </article>
          )
        })}
    </div>
    )
  }
}

