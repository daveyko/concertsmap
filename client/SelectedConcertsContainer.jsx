import React, {Component} from 'react'
import Map from './Map.jsx'
import Sidebar from './Sidebar.jsx'

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      selectedConcerts: []
    }
    this.filterConcertsByGenre = this.filterConcertsByGenre.bind(this)
    this.addConcert = this.addConcert.bind(this)
    this.removeConcert = this.removeConcert.bind(this)
    this.sortSelectedConcerts = this.sortSelectedConcerts.bind(this)
    this.selectAllConcerts = this.selectAllConcerts.bind(this)
    this.removeAllConcerts = this.removeAllConcerts.bind(this)
  }

  //this prevents unnecessary re-render when we are passing new props to the modal and so the bacgkround map and sidebar don't need to be re-rendered
  shouldComponentUpdate(nextProps, nextState){
    if (this.props.concerts !== nextProps.concerts){
      return true
    }
    if (this.props.genres !== nextProps.genres){
      return true
    }
    if (this.state.selectedConcerts !== nextState.selectedConcerts){
      return true
    }
    return false
  }

  componentWillReceiveProps(nextProps){
    if (this.props.startDate !== nextProps.startDate){
      this.setState({
        selectedConcerts: []
      })
    }
  }

  //this class contains methods to filter concerts and select/remove concerts to/from the sidebar component

  selectAllConcerts(){
    //removes all duplicate concerts
    //we need to map over the array of concert objects and replace them with concert names to compare and remove duplicate objects
    this.setState({
      selectedConcerts: JSON.parse(localStorage.getItem(JSON.stringify(this.props.startDate))).filter((concert, pos, arr) => {
        return arr.map(concertObj => concertObj.displayName).indexOf(concert.displayName) === pos
      })
    })
  }

  removeAllConcerts(){
    this.setState({
      selectedConcerts: []
    })
  }

  filterConcertsByGenre(genre){
    let concerts
    let allConcerts = JSON.parse(localStorage.getItem(JSON.stringify(this.props.startDate)))
    if (genre === 'all'){
      concerts = allConcerts
    } else if (genre === 'n/a'){
      concerts = allConcerts.filter(concert => {
        return concert.performance.filter(perf => {
          return perf.genres.length === 0
        }).length >= 1
    })} else {
      concerts = allConcerts.filter(concert => {
        return concert.performance.filter(perf => {
          return perf.genres.join('').includes(genre)
        }).length >= 1
      })
    }
    this.setState({
      selectedConcerts: concerts
    })
  }

  sortSelectedConcerts(criteria){
    let sorted = this.state.selectedConcerts.slice().sort((a, b) => {
      return b[criteria] - a[criteria]
    })
    this.setState({
      selectedConcerts: sorted
    })
  }

  addConcert(selectedConcert) {
    //check if concert already exists in selected concerts array
    if (!this.state.selectedConcerts.filter(concert => {
      return concert.displayName === selectedConcert.displayName
      }).length) {
      this.setState({
        selectedConcerts: this.state.selectedConcerts.concat(selectedConcert)
      })
    }
  }

  removeConcert(selectedConcert){
    this.setState({
      selectedConcerts: this.state.selectedConcerts.filter(concert => {
        return concert.displayName !== selectedConcert.displayName
      })
    })
  }

  render(){
    return (
      <div id = "app">
        <Map concerts = {this.state.selectedConcerts.length ? this.state.selectedConcerts : this.props.concerts} addConcert = {this.addConcert} />
        <Sidebar
          removeAllConcerts = {this.removeAllConcerts} selectAllConcerts = {this.selectAllConcerts} sortSelectedConcerts = {this.sortSelectedConcerts}
          removeConcert = {this.removeConcert} selectedConcerts = {this.state.selectedConcerts} filterConcertsByGenre = {this.filterConcertsByGenre} genres = {this.props.genres} handleDateChange = {this.props.handleDateChange} startDate = {this.props.startDate} />
      </div>
    )
  }
}
