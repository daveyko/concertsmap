import React, {Component} from 'react'
import App from './App.jsx'
import LoginModal from './Login.jsx'
import axios from 'axios'

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      loggedIn: false,
      loggedInModal: false,
    }
    this.handleLogOut = this.handleLogOut.bind(this)
    this.checkLoggedIn = this.checkLoggedIn.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.handleComponentError = this.handleComponentError.bind(this)
  }

  componentDidMount(){
    //if logged in, check if token is valid to make api requests to spotify
    //if token is invalid, error handler will refresh the token
    //else render login modal
    return this.checkLoggedIn()
    .then(isLoggedIn => {
      if (isLoggedIn){
        return this.checkToken()
      } else {
        this.setState({
          loggedInModal: true
        })
      }
    })
    .catch(err => {
      console.error(err)
      this.handleComponentError(err)
    })
  }

  //if the error occurs and status is 401 - unauthorized, refresh token
  async handleComponentError(err){
    if (err.response && err.response.status === 401){
      try {
        await this.handleRefresh()
      }
      catch(err){
        console.error(err)
      }
    }
  }

  async checkLoggedIn(){

    let res = await axios.get('/api/auth')
    //check if the res.data object is empty
    if (Object.keys(res.data).length === 0 && res.data.constructor === Object) {
      localStorage.clear()
      this.setState({loggedIn: false})
      return false
    } else {
      localStorage.setItem('currentAccessToken', res.data.accessToken)
      localStorage.setItem('currentRefreshToken', res.data.refreshToken)
      this.setState({loggedIn: true})
      return true
      }
    }

  async checkToken(){
    let raw
    //send an api request to see if token is still valid
    try {
      raw = await axios({
        method: 'GET',
        url: `https://api.spotify.com/v1/search?q=Drake&type=artist&limit=1`,
        headers: {
          'Authorization': 'Bearer ' + localStorage.getItem('currentAccessToken')
        }
      })
      return raw
    }
    catch(err){
      console.error(err)
      //error handled in handle component error
      throw (err)
    }
  }

  async handleRefresh(){
    let body
    try {
      body = await axios.post('/api/auth/refresh', {
        refreshToken: localStorage.getItem('currentRefreshToken')
      })
      localStorage.setItem('currentAccessToken', body.data.accessToken)
      return body
    }
    catch(err) {
      console.error(err)
      throw (err)
     }
   }

  handleLogOut(){
    axios.get('/api/auth/logout')
    .then(() => {
      localStorage.clear()
      this.setState({
        loggedIn: false,
        loggedInModal: true
      })
    })
    .catch(console.error)
  }

  toggleModal(modal){
    this.setState(prevState => {
       return {
         loggedInModal : !prevState.loggedInModal
       }
    })
  }

  render(){
    if (!this.state.loggedInModal){
      return (
        <div>
          <App handleRefresh = {this.handleRefresh}handleLogOut = {this.handleLogOut} loggedIn = {this.state.loggedIn} />
        </div>
      )
    } else {
      return (
        <div>
          <LoginModal toggleModal = {this.toggleModal} modal = {this.state.loggedInModal} />
        </div>
      )
    }
  }
}
