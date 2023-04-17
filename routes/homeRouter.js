const router = require('express').Router()
const {homeHandler} = require('../controllers/homeController')

router.get('/', homeHandler)

module.exports = router
