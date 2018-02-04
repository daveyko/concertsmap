import React, {Component} from 'react'
import {withStyles} from 'material-ui/styles'
import {MenuItem} from 'material-ui/Menu'
import Select from 'material-ui/Select'
import {FormControl} from 'material-ui/Form'
import Button from 'material-ui/Button'
const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  input: {
    display: 'none'
  },
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

class SelectedConcerts extends Component{
  constructor(props){
      super(props)
      this.state = {
        filter: null
      }
      this.handleFilter = this.handleFilter.bind(this)
  }

  handleFilter(e){
    this.setState({
      filter: e.target.value
    })
  }


  render(){
    const { classes } = this.props;
    return (
      <div className="panel" id="selected-concerts">
        <div>
          <h2>Filter By</h2>
          <div className = "filter">
          {this.props.selectedConcerts.length ?
            <FormControl className={classes.formControl}>
                <Select
                id="genres" value = {this.state.filter}
                onChange = {(e) => {
                  this.handleFilter(e)
                  this.props.sortSelectedConcerts(e.target.value)
                }}>
                <MenuItem value = "popularity">popularity</MenuItem>
                </Select>
            </FormControl> : null}
          </div>
        </div>
        <div>
          <h2>Selected Concerts</h2>
          {this.props.startDate ?
            <div className = "filter">
              <Button raised onClick = {this.props.selectAllConcerts}>Select All</Button>
              <Button raised onClick = {this.props.removeAllConcerts}>Remove All</Button>
            </div> : null }
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

export default withStyles(styles)(SelectedConcerts)
