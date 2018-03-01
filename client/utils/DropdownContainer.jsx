import React, {Component} from 'react'
import DropdownList from './DropdownList.jsx'

export default class DropdownContainer extends Component{
    constructor(props){
      super(props)
      this.state = {
        display: 'select genre',
        genres: this.props.genres,
        showDropdown: false
      }
      this.handleSelect = this.handleSelect.bind(this)
      this.toggleShow = this.toggleShow.bind(this)
    }

    componentWillReceiveProps(nextProps){
      if (nextProps.genres !== this.props.genres){
        this.setState({
          genres: nextProps.genres
        })
      }
    }

    handleSelect(display){
      this.setState({
        display
      })
    }

    toggleShow(bool){
      document.removeEventListener('click', this.toggleShow)
      if (typeof arguments[0] === 'object'){
        this.setState(prevState => {
          return {
            showDropdown: !prevState.showDropdown
          }
        }, () => {
          if (this.state.showDropdown){
            document.addEventListener('click', this.toggleShow)
          }
        })
      } else {
        this.setState({
          showDropdown: bool
        })
      }
  }


    render(){
      console.log('genres', this.state.genres)
      return (
        <div className = "wrapper">
            <div
            onClick = {this.toggleShow}
            className = "dropdown-top">
              <div className = "text">{this.state.display}</div>
              <i className = {this.state.showDropdown ? 'fa fa-chevron-up' : 'fa fa-chevron-down'} />
            </div>
          {this.state.showDropdown ? <DropdownList filterByGenre = {this.props.filterByGenre} showDropdown = {this.state.showDropdown} toggleShow = {this.toggleShow} handleSelect = {this.handleSelect} items = {this.state.genres} /> : null}
        </div>
    )
  }
}
