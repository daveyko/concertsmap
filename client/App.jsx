import React, {Component} from 'react'
import Header from './Header.jsx'
import Loading from './Loading.jsx'
import SelectedConcertsContainer from './SelectedConcertsContainer.jsx'
import axios from 'axios'

export default class Home extends Component{
  constructor(props){
    super(props)
    this.state = {
      concerts: [],
      startDate: null,
      genres: [],
      loadingModal: false,
      errorMessage: '',
      rawNumRequestProcessed:0,
      totalRequestsToProcess: 0
    }
    this.handleDateChange = this.handleDateChange.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.requestThrottle = this.requestThrottle.bind(this)
    this.handleDateChangeErr = this.handleDateChangeErr.bind(this)
  }

   toggleModal(modal){
    this.setState(prevState => {
       return {
         loadingModal : !prevState.loadingModal,
         errorMessage: ''
       }
    })
  }

  async requestThrottle(combinedData, date){
    let addedGenres = []

    //this function returns a promise that will be resolved after 5 seconds
    //this is used to throttle the requests to spotify so that we don't run into rate limits
    function delay(){
      return new Promise(resolve => setTimeout(resolve, 1000))
    }

    //total number of concerts to gather spotify genre/image data for to pass to loading modal
    let totalToProcess = combinedData.reduce((accum, curr) => {
      return accum + curr.length
    }, 0)

    this.setState({
      totalRequestsToProcess: totalToProcess
    })

    //for all sets of 25 concerts, after sending 25 spotify requests we pause the for loop for 5 seconds
    //before sending the next batch of 25 api requests
    for (let i = 0; i < combinedData.length; i++){
        try {
          addedGenres = addedGenres.concat(await this.getGenreWrapper(combinedData[i]))
          await delay()
        }
        catch(err){
          console.error(err)
          localStorage.removeItem(JSON.stringify(date))
          throw err
        }
      }
      return addedGenres
  }

  async getGenreWrapper(combinedData){
    //the wrapper actually calls the function that will send an api request to spotify
    for (let i = 0; i < combinedData.length; i++){
      let performance = combinedData[i].performance
      this.setState(prevState => {
        return {rawNumRequestProcessed: prevState.rawNumRequestProcessed + 1}
      })
      for (let j = 0; j < performance.length; j++){
        try {
          //we await the aggregate genres array and image of the first artist with an available image
          let resObj = await this.getGenre(performance[j].artist.displayName)
          //we create a copy of the performance object and insert two new properties of an array of genres and an artist image
          performance[j] = Object.assign({}, performance[j], {genres: resObj.genresArr, image: resObj.artistImage})
        }
        catch(err){
          console.error(err)
          //error will be handled by handleDateChange function
          throw err
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
          'Authorization': 'Bearer ' + localStorage.getItem('currentAccessToken')
        }
      })
    } catch (err){
      //error will be handled by handleDateChange function
      throw err
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


  getTopGenres(concerts){
    let genres = []
    let genresObj
    let genresArr
    let top2Arr
    concerts.forEach(concert => {
      let topGenresArr = concert.performance.forEach(perf => {
        genresObj = {}
        if (perf.genres.length){
          //we are iterating through an array of genres for each performance after removing any trailing/preceding spaces
           perf.genres.join(',').split(/[\s,]+/).forEach(word => {
          if (!genresObj[word]) genresObj[word] = 1;
          else {
            genresObj[word]++
          }
        })
          //now we have an array of objects with key value pair representing the genre and the frequency of the genre
          genresArr = Object.keys(genresObj).map(genre => {
          return {genre, value: genresObj[genre]}
        })
          //if the genres length is greater than or equal to 2 we sort then return an array just genres
          top2Arr = genresArr.length >= 2 ? genresArr.sort((p1,p2) => p2.value - p1.value).slice(0,2).map(obj => obj.genre) : genresArr.sort((p1,p2) => p2.value - p1.value).map(obj => obj.genre)

          top2Arr.forEach(el => {
            genres.push(el)
          })
        }
      })
    })
    //we return an array of genres of all the performances, remove the duplicates, and sort in alphabetical order
    return genres.filter((item, pos) => {
      return genres.indexOf(item) === pos
    }).sort()
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
    //if we have our final concerts array stored for the specific date on the browser, return the cached results
    if (localStorage.getItem(JSON.stringify(date))){
      return {cached: JSON.parse(localStorage.getItem(JSON.stringify(date)))}
    } else {
      //we need to make an initial request to songkick for all concerts on a specific date
      rawAjaxConcerts = await axios.get(`https://api.songkick.com/api/3.0/metro_areas/7644/calendar.json?apikey=SplxOabkNDI5R6lO&min_date=${date.format('YYYY-MM-DD')}&max_date=${date.format('YYYY-MM-DD')}`)
      totalPages = Math.ceil(rawAjaxConcerts.data.resultsPage.totalEntries / 50)
      //for each page of the result, we store the request in an array of promises
      for (let page = 1; page <= totalPages; page++){
        requestPromise = axios.get(`https://api.songkick.com/api/3.0/metro_areas/7644/calendar.json?apikey=SplxOabkNDI5R6lO&min_date=${date.format('YYYY-MM-DD')}&max_date=${date.format('YYYY-MM-DD')}&page=${page}`)
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
        return results.cached
      } else {
        let combinedData = []
        results.nonCached.forEach(dataPage => {
          combinedData = combinedData.concat(dataPage.data.resultsPage.results.event)
        })
        groupedCombinedData = this.groupInto25(combinedData)
        localStorage.setItem(JSON.stringify(date), JSON.stringify(groupedCombinedData))
        return this.requestThrottle(groupedCombinedData, date)
      }
    })
    .then(addedGenres => {
      let genres = this.getTopGenres(addedGenres)
      localStorage.setItem(JSON.stringify(date), JSON.stringify(addedGenres))
      this.setState({
        genres,
        concerts: addedGenres,
        loadingModal: false,
        rawNumRequestProcessed: 0,
        totalRequestsToProcess: 0
      })
    })
    .catch(err => {
      this.handleDateChangeErr(err, date)
  })
  }

  //if the token has expired, we refresh the token, and retry the request to spotify
  handleDateChangeErr(err, date){
    if (err.response && err.response.status === 401){
      this.props.handleRefresh()
      .then(() => {
        this.handleDateChange(date)
      })
    } else {
      this.setState({
        errorMessage: 'Request failed. Please try again.'
      })
    }
  }

  render(){
    return (
      <div>
      <Header loggedIn = {this.props.loggedIn} handleLogOut = {this.props.handleLogOut} />
        {this.state.loadingModal ? <Loading loadingModal = {this.state.loadingModal} toggleModal = {this.toggleModal} errorMessage = {this.state.errorMessage} percentageComplete = {this.state.rawNumRequestProcessed / this.state.totalRequestsToProcess}/> : null}
        <SelectedConcertsContainer handleDateChange = {this.handleDateChange} startDate = {this.state.startDate} genres = {this.state.genres} concerts = {this.state.concerts} />
      </div>
    )
  }
}

