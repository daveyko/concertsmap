import React from 'react'

const Header = (props) => {
    return (
      <header>
        <h1>Concert Finder</h1>
        {!props.loggedIn ?  <a href = "/api/spotify">
        <i className="fa fa-spotify" aria-hidden="true" />
        </a> :
        <div className = "logoutRefresh">
          <h3 onClick = {props.handleLogOut}>Logout</h3>
          </div>}
      </header>
    )
}

export default Header

