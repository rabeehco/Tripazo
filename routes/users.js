const express = require('express')
const router = express.Router()
const passport = require('passport')
const catchAsync = require('../utils/CatchAsync')
const User = require('../models/user')
const users = require('../controllers/users')
const {noCache} = require('../middleware')

router.route('/register')
    .get(noCache, users.renderRegister)
    .post(catchAsync(users.register))

router.route('/login')
    .get(noCache, users.userLogin)
    .post(passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)


router.get('/logout', users.logout);

module.exports = router;