const express = require('express')
const router = express.Router()
const campgrounds = require('../controllers/campgrounds')
const catchAsync = require('../utils/CatchAsync')
const {isLoggedIn, isAuthor, validateCampground} = require('../middleware')
const Campground = require('../models/campground')
const multer = require('multer')
const { storage } = require('../cloudinary')
const upload = multer({ storage })
const {noCache} = require('../middleware')

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground))  

router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    .get(noCache ,catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateCampground, catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground))

router.get('/:id/edit', noCache, isLoggedIn, isAuthor, catchAsync(campgrounds.renderEditForm))

module.exports = router