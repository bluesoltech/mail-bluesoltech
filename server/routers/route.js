const router = require('express').Router();
const {signUp, getBill} = require('../controller/appController.js')

// HTTP request
router.post('/user/signup', signUp)
router.post('/product/getbill', getBill)

module.exports = router;