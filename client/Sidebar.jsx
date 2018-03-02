import React, {Component} from 'react'
import DatePicker from 'react-datepicker'
import SelectedConcerts from './SelectedConcerts.jsx'
import DropdownContainer from './utils/DropdownContainer.jsx'
require('react-datepicker/dist/react-datepicker.css')

class Sidebar extends Component {

  constructor(props){
    super(props)
    this.state = {
      genre: ''
    }
    this.handleGenreSelect = this.handleGenreSelect.bind(this)
  }

  handleGenreSelect(e){
    this.setState({
      genre: e.target.value
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
          selected = {this.props.startDate}
          onChange = {this.props.handleDateChange}
          />
        </div>
        <div>
          <h2>Select Genre</h2>
            <div className = "filter">
            {this.props.startDate ?
              <DropdownContainer display = "select genre" items = {this.props.genres} onClick = {this.props.filterConcertsByGenre} />
               : null}
          </div>
        </div>
      </div>
      <SelectedConcerts removeAllConcerts = {this.props.removeAllConcerts} selectAllConcerts = {this.props.selectAllConcerts} sortSelectedConcerts = {this.props.sortSelectedConcerts} selectedConcerts = {this.props.selectedConcerts} removeConcert = {this.props.removeConcert} startDate = {this.props.startDate}  />
    </aside>
    )
  }
}

export default Sidebar
