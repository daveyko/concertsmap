import React, {Component} from 'react'
import axios from 'axios'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import SelectedConcerts from './SelectedConcerts.jsx'
// import 'react-datepicker/dist/react-datepicker.css'

export default class Sidebar extends Component {

  constructor(props){

    super(props)
    this.state = {
      filterGenre: null
    }

    this.handleGenreSelect = this.handleGenreSelect.bind(this)
  }

  handleGenreSelect(e){
    this.setState({
      filterGenre: e.target.value
    })
  }


  render(){

    return (
      <aside>
      <div className="panel" id="options-panel">
        <div>
          <h2>Select Date</h2>
          <DatePicker
          dateFormat="YYYY-MM-DD"
          placeholderText = "Click to select a date"
          selected = {this.props.startDate}
          onChange = {this.props.handleDateChange}
          />
        </div>
        <div>
          <h2>Select Genre</h2>
            <div className = "filter">
              <select id="genres" onChange = {(e) => this.handleGenreSelect(e)}>
              <option>Select Genre</option>
              <option value = "all">All</option>
              <option value = "n/a">N/A</option>
              {this.props.genres.map((genre, i) => {
                return (
                  <option key ={i} value = {genre}>{genre}</option>
                )
              })}
              </select>
              <button onClick = {() => {
                if (this.state.filterGenre)  this.props.filterConcertsByGenre(this.state.filterGenre)
               }}>filter</button>
            </div>
        </div>
      </div>
      <SelectedConcerts removeAllConcerts = {this.props.removeAllConcerts} selectAllConcerts = {this.props.selectAllConcerts} sortSelectedConcerts = {this.props.sortSelectedConcerts} selectedConcerts = {this.props.selectedConcerts} removeConcert = {this.props.removeConcert}  />
    </aside>
    )
  }
}
