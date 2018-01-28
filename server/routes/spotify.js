const router = require('express').Router()
const passport = require('passport')
const models = require('../models')
const axios = require('axios')
const User = models.User
const SpotifyStrategy = require('passport-spotify').Strategy
if (process.env.NODE_ENV !== 'production') require('../../secrets')

module.exports = router


passport.use(new SpotifyStrategy({
	clientID: process.env.SPOTIFY_CLIENT_ID,
	clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
	callbackURL: process.env.SPOTIFY_CALLBACK
},
function(accessToken, refreshToken, profile, done) {
	User.findOrCreate({ where: {
		spotifyId: profile.id
	},
	defaults: {
		spotifyId: profile.id,
		accessToken: accessToken,
		refreshToken: refreshToken
	}
	})
		.spread((user) => {
			done(null, user)
		})
		.catch(done)
}))

router.get('/',
	passport.authenticate('spotify', {scope: ['user-read-email', 'user-read-private'], showDialog: true}),
	function(req, res){
		// The request will be redirected to spotify for authentication, so this
		// function will not be called.
	})

router.get('/callback',
	passport.authenticate('spotify', { failureRedirect: '/' }),
	function(req, res) {
		console.log('USER', req.user)
		// Successful authentication, redirect home.
		res.redirect('/')
	})

