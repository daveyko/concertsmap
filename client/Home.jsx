import React, {Component} from 'react'
import Header from './Header.jsx'
import Sidebar from './Sidebar.jsx'
import Map from './Map.jsx'
import Login from './Login.jsx'
import Loading from './Loading.jsx'
import axios from 'axios'

// require('../secrets')

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      concerts: [],
      startDate: null,
      selectedConcerts: [],
      loggedIn: false,
      genres: [],
      modal: false,
      loadingModal: false,
      errorMessage: ''
    }
    this.handleLogOut = this.handleLogOut.bind(this)
    this.checkLoggedIn = this.checkLoggedIn.bind(this)
    this.handleDateChange = this.handleDateChange.bind(this)
    this.filterConcertsByGenre = this.filterConcertsByGenre.bind(this)
    this.addConcert = this.addConcert.bind(this)
    this.removeConcert = this.removeConcert.bind(this)
    this.sortSelectedConcerts = this.sortSelectedConcerts.bind(this)
    this.selectAllConcerts = this.selectAllConcerts.bind(this)
    this.removeAllConcerts = this.removeAllConcerts.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.requestThrottle = this.requestThrottle.bind(this)
    this.handleComponentError = this.handleComponentError.bind(this)
    this.handleDateChangeErr = this.handleDateChangeErr.bind(this)
  }

  componentDidMount(){
    this.checkLoggedIn()
    .then(isLoggedIn => {
      if (isLoggedIn){
        return this.checkToken()
      } else {
        console.log('ISLOGGEDIN', isLoggedIn)
        this.toggleModal('modal')()
      }
    })
    .then(res => {
        console.log('token checked and valid!')
    })
    .catch(err => {
      console.log('err in comp did mount', err)
      this.handleComponentError(err)
    })
  }

  handleComponentError(err){
    if (err.response && err.response.status === 401){
      this.handleRefresh()
      .then(() => {
        console.log('token refreshed!')
      })
    }
  }

  toggleModal(modal){
    return () => {
      console.log('togglemodalcalled!', modal)
      this.setState({
        [modal] : !this.state[modal]
      })
      if (modal === 'loadingModal'){
        this.setState({
          errorMessage: ''
        })
      }
    }
  }

  async checkToken(){
    let raw
    try {
      raw = await axios({
      method: 'GET',
      url: `https://api.spotify.com/v1/search?q=Drake&type=artist&limit=1`,
      headers: {
        'Authorization': 'Bearer ' + sessionStorage.getItem('currentAccessToken')
      }
    })
  } catch(error){
    throw (error)
  }
  return raw
  }

  async requestThrottle(combinedData, date){
    let addedGenres = []

    function delay(){
      return new Promise(resolve => setTimeout(resolve, 5000))
    }

    for (let i = 0; i < combinedData.length; i++){
      try{
        addedGenres = addedGenres.concat(await this.getGenreWrapper(combinedData[i]))
        console.log('25 requests made!')
        await delay()
      } catch(e){
        sessionStorage.removeItem(JSON.stringify(date))
        console.log('reqthrottleerrr!', e)
        throw e
      }
    }
    return addedGenres
  }

  async getGenreWrapper(combinedData){
    for (let i = 0; i < combinedData.length; i++){
      let performance = combinedData[i].performance
      for (let j = 0; j < performance.length; j++){
        try{
          let resObj = await this.getGenre(performance[j].artist.displayName)
          performance[j] = Object.assign({}, performance[j], {genres: resObj.genresArr, image: resObj.artistImage})
        } catch(e){
          console.log('genrewrapperERR!!!')
          throw e
        }
      }
    }
    return combinedData
  }



  async getGenre(artist){
    let raw
    try{
      raw = await axios({
        method: 'GET',
        url: `https://api.spotify.com/v1/search?q=${artist}&type=artist&limit=1`,
        headers: {
          'Authorization': 'Bearer ' + sessionStorage.getItem('currentAccessToken')
        }
      })
    } catch (error){
      raw = {
        data: {
          artists:{
            items : []
          }
        }
      }
      console.log('getGenreeerrr', error)
      throw error
    }

      let genresArr
      let artistImage
      if (raw.data.artists.items.length){
        genresArr = raw.data.artists.items[0].genres
        if (raw.data.artists.items[0].images.length){
          artistImage = raw.data.artists.items[0].images[0].url
        }
      } else {
        genresArr = []
        artistImage = ''
      }
      return {genresArr, artistImage}
  }

  filterConcertsByGenre(genre){
    let concerts
    let allConcerts = JSON.parse(sessionStorage.getItem('allConcerts'))
    console.log('allconcerts', allConcerts)
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
          return perf.genres.join("").includes(genre)
        }).length >= 1
      })
    }
    this.setState({
      concerts
    })
  }

  getTopGenres(concerts){
    let genres = []
    concerts.forEach(concert => {
      let topGenresArr = concert.performance.forEach(perf => {
        let genresObj = {}
        if (perf.genres.length){
           perf.genres.join(',').split(/[\s,]+/).forEach(word => {
          if (!genresObj[word]) genresObj[word] = 1;
          else {
            genresObj[word]++
          }
        })
        let genresArr = Object.keys(genresObj).map(genre => {
          return {genre, value: genresObj[genre]}
        })

        let top3Arr = genresArr.length >= 2 ? genresArr.sort((p1,p2) => p2.value - p1.value).slice(0,2).map(obj => obj.genre) : genresArr.sort((p1,p2) => p2.value - p1.value).map(obj => obj.genre)

        top3Arr.forEach(el => {
          genres.push(el)
        })
        }
      })
    })
    return genres.filter((item, pos) => {
      return genres.indexOf(item) === pos
    }).sort()
  }

  handleLogOut(){
    axios.get('/api/auth/logout')
    .then(() => {
      sessionStorage.clear()
      this.setState({loggedIn: false})
    })
  }

  async handleRefresh(){
   let body = await axios.post('/api/auth/refresh', {
     refreshToken: sessionStorage.getItem('currentRefreshToken')
   })
   console.log('refresh response!', body)
   sessionStorage.setItem('currentAccessToken', body.data.accessToken)
   return body
  }

  checkLoggedIn(){
    return new Promise(resolve => {
      axios.get('/api/auth')
      .then(res => {
        if (Object.keys(res.data).length === 0 && res.data.constructor === Object) {
          sessionStorage.clear()
          this.setState({loggedIn: false})
          resolve(false)
        }
        else {
          sessionStorage.setItem('currentAccessToken', res.data.accessToken)
          sessionStorage.setItem('currentRefreshToken', res.data.refreshToken)
          this.setState({loggedIn: true})
          resolve(true)
        }
      })
      .catch(err => console.log('error check logged in', err))
    })
  }

  groupInto25(combinedData){
    let wrapper = []
    let grouping = []
    let counter = 25
    for (let i = 0; i < combinedData.length; i++){
      grouping.push(combinedData[i])
      counter --
      if (counter === 0){
        wrapper.push(grouping)
        counter = 25
        grouping = []
      }
    }
    if (grouping.length) wrapper.push(grouping)
    return wrapper
  }


  async checkCacheConcerts(date){
    let totalPages
    let rawAjaxConcerts
    let requestPromise
    let getRequestPromises = []
    let allConcerts
    if (sessionStorage.getItem(JSON.stringify(date))){
      console.log('CACHED!')
      return {cached: JSON.parse(sessionStorage.getItem(JSON.stringify(date)))}
    } else {
      rawAjaxConcerts = await axios.get(`http://api.songkick.com/api/3.0/metro_areas/7644/calendar.json?apikey=SplxOabkNDI5R6lO&min_date=${date.format('YYYY-MM-DD')}&max_date=${date.format('YYYY-MM-DD')}`)
      totalPages = Math.ceil(rawAjaxConcerts.data.resultsPage.totalEntries / 50)
      for (let page = 1; page <= totalPages; page++){
        requestPromise = axios.get(`http://api.songkick.com/api/3.0/metro_areas/7644/calendar.json?apikey=SplxOabkNDI5R6lO&min_date=${date.format('YYYY-MM-DD')}&max_date=${date.format('YYYY-MM-DD')}&page=${page}`)
        getRequestPromises.push(requestPromise)
      }
      allConcerts = await Promise.all(getRequestPromises)
      return {nonCached: allConcerts}
    }
  }


  handleDateChange(date){
    let groupedCombinedData
    this.setState({
      startDate: date,
      loadingModal: true
    })
    this.checkCacheConcerts(date)
    .then(results => {
      if (results.cached){
        console.log('CACHED!', results)
        groupedCombinedData = results.cached
        return groupedCombinedData
      } else {
        let combinedData = []
        results.nonCached.forEach(dataPage => {
          combinedData = combinedData.concat(dataPage.data.resultsPage.results.event)
        })
        groupedCombinedData = this.groupInto25(combinedData)
        sessionStorage.setItem(JSON.stringify(date), JSON.stringify(groupedCombinedData))
        return this.requestThrottle(groupedCombinedData, date)
      }
    })
    .then(addedGenres => {
      let genres = this.getTopGenres(addedGenres)
      sessionStorage.setItem('allConcerts', JSON.stringify(addedGenres))
      this.setState({
        genres,
        concerts: addedGenres,
        loadingModal: false
      })
    })
    .catch(err => {
      console.log('error in HandleDateChange!', err)
      this.handleDateChangeErr(err, date)
  })
  }

  handleDateChangeErr(err, date){
    if (err.response && err.response.status === 401){
      this.handleRefresh()
      .then(() => {
        console.log('calling handleDateChange again after token refresh!')
        this.handleDateChange(date)
      })
    } else {
      console.log('datechangeerr not 401', err)
      this.setState({
        errorMessage: 'Request failed. Please try again.'
      })
    }
  }

  addConcert(selectedConcert) {

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

  sortSelectedConcerts(){
    let sorted = this.state.selectedConcerts.sort((a,b) => {
      return b.popularity - a.popularity
    })
    this.setState({
      selectedConcerts: sorted
    })
  }

  selectAllConcerts(){


    this.setState({
      selectedConcerts: JSON.parse(sessionStorage.getItem('allConcerts')).filter((concert, pos, arr) => {
        return arr.map(concertObj => concertObj.displayName).indexOf(concert.displayName) === pos
      })
    })
  }

  removeAllConcerts(){

    this.setState({
      selectedConcerts: []
    })
  }

  render(){

    console.log('CONCERTS!', this.state)

    return (
      <div>
      <Header handleRefresh = {this.handleRefresh} loggedIn = {this.state.loggedIn} handleLogOut = {this.handleLogOut} />
      {this.state.modal ? <Login modal = {this.state.modal} toggleModal = {this.toggleModal} /> : null}
        <div id = "app">
          <Loading loadingModal = {this.state.loadingModal} toggleModal = {this.toggleModal} errorMessage = {this.state.errorMessage}/>
          <Map addConcert = {this.addConcert} concerts = {this.state.concerts} />
          <Sidebar removeAllConcerts = {this.removeAllConcerts}selectAllConcerts = {this.selectAllConcerts} sortSelectedConcerts = {this.sortSelectedConcerts}
          removeConcert = {this.removeConcert} selectedConcerts = {this.state.selectedConcerts} filterConcertsByGenre = {this.filterConcertsByGenre} genres = {this.state.genres} handleDateChange = {this.handleDateChange} startDate = {this.state.startDate} />
        </div>
      </div>
    )
  }

}

