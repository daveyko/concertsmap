const router = require('express').Router()
module.exports = router

router.use('/spotify', require('./spotify'))
router.use('/auth', require('./auth'))

