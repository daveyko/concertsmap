import React, {Component} from 'react'
import DatePicker from 'react-datepicker'
import SelectedConcerts from './SelectedConcerts.jsx'
import {withStyles} from 'material-ui/styles'
import {MenuItem} from 'material-ui/Menu'
import Select from 'material-ui/Select'
import {FormControl} from 'material-ui/Form'
import TextField from 'material-ui/TextField'
require('react-datepicker/dist/react-datepicker.css')

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
})

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
    const { classes } = this.props;
    return (
      <aside>
      <div className="panel" id="options-panel">
        <div>
          <h2>Select Date</h2>
          <DatePicker
          dateFormat="YYYY-MM-DD"
          selected = {this.props.startDate}
          onChange = {this.props.handleDateChange}
          customInput = {<TextField label = "YYYY-MM-DD" placeholder = "Placeholder" />}
          />
        </div>
        <div>
          <h2>Select Genre</h2>
            <div className = "filter">
            {this.props.startDate ?
              <form className={classes.container} autoComplete="off">
                <FormControl className={classes.formControl}>
                  <Select
                  id="genres" value = {this.state.genre}
                  onChange = {(e) => {
                    this.handleGenreSelect(e)
                    this.props.filterConcertsByGenre(e.target.value)
                  }}>
                  <MenuItem value = "all">All</MenuItem>
                  <MenuItem value = "n/a">N/A</MenuItem>
                  {this.props.genres.map((genre, i) => {
                    return (
                      <MenuItem key ={i} value = {genre}>{genre}</MenuItem>
                    )
                  })}
                  </Select>
               </FormControl>
              </form>
               : null}
          </div>
        </div>
      </div>
      <SelectedConcerts removeAllConcerts = {this.props.removeAllConcerts} selectAllConcerts = {this.props.selectAllConcerts} sortSelectedConcerts = {this.props.sortSelectedConcerts} selectedConcerts = {this.props.selectedConcerts} removeConcert = {this.props.removeConcert} startDate = {this.props.startDate}  />
    </aside>
    )
  }
}

export default withStyles(styles)(Sidebar)
