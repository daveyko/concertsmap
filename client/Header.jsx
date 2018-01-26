import React, {Component} from 'react'
import axios from 'axios'

export default class Header extends Component{

  render(){
    return (
      <header>
        <h1>Concert Finder</h1>
        {!this.props.loggedIn ?  <a href = "/api/spotify">
        <i className="fa fa-spotify" aria-hidden="true" />
        </a> :
        <div className = "logoutRefresh">
          <h3 onClick = {this.props.handleLogOut}><a id = "logout" href = "#">Logout</a></h3>

          {/* <a href = "#" onClick = {this.props.handleRefresh}><i className="fa fa-refresh" aria-hidden="true" /></a> */}

          </div>}

      </header>
    )
  }

}

