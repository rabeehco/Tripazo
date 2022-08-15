const { cloudinary } = require('../cloudinary')
const Campground = require('../models/campground')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

/* Show Campgrounds */
module.exports.index = async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campgrounds/index', {campgrounds})
}

/* New Campground Form Page */
module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new')
}

/* Create Campground */
module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    const campground = new Campground(req.body.campground)
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    campground.author = req.user._id;
    await campground.save()
    console.log(campground) 
    req.flash('success', 'Successfully made a new campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

/* Show a Campground Page */
module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author')
    if (! campground) {
        req.flash('error', 'Cannot Find The Campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/show', {campground})
}

/* Render Edit Campground Form */
module.exports.renderEditForm = async (req, res) => {
    const {id} = req.params;
    const campground = await Campground.findById(id)
    if (! campground) {
        req.flash('error', 'Cannot Find The Campground')
        return res.redirect('/campgrounds')
    }
    res.render('campgrounds/edit', {campground})
}

/* Update Campground */
module.exports.updateCampground = async (req, res) => {
    const {id} = req.params;
    console.log(req.body)
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    })
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}))
    campground.images.push(... imgs);
    await campground.save()
    if (req.body.deleteImages) {
     for(let filename of req.body.deleteImages){
        await cloudinary.uploader.destroy(filename)
     }
     await campground.updateOne({
            $pull: {
                images: {
                    filename: {
                        $in: req.body.deleteImages
                    }
                }
            }
        })
        console.log(campground)
    }


    req.flash('success', 'Successfully Updates Campground')
    res.redirect(`/campgrounds/${
        campground._id
    }`)
}

/* Delete Campground */
module.exports.deleteCampground = async (req, res) => {
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully Deleted The Campground')
    res.redirect('/campgrounds')
}
