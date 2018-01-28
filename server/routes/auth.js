const router = require('express').Router()
const models = require('../models')
var request = require('request')
const User = models.User
if (process.env.NODE_ENV !== 'production') require('../../secrets')


module.exports = router

router.get('/', (req, res) => {
  req.user ? res.json(req.user) : res.json({})
})

router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('/')
})


router.post('/refresh', (req, res) => {
    if (!req.user){
      res.send('Please sign in!')
      res.redirect('/')
    }
    console.log('here at refresh!', req.body.refreshToken)
    let auth = 'Basic ' + new Buffer(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')

    let jsonData = {
      grant_type: 'refresh_token',
      refresh_token: req.body.refreshToken
    }

    let authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization: auth,
      },
      form: jsonData,
      json: true
    }

    request.post(authOptions, (error, response, body) => {
      if (!error){
        console.log('body', body)
        let accessToken = body.access_token
        console.log('accessToken', body.access_token)
        User.update({
          accessToken
        },
        {where: {id: req.user.id}}
      )
      res.send({
        accessToken
      })
      } else {
        console.log(error)
      }
    })
  })

