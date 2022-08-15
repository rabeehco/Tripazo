const User = require('../models/user')



/* Render Register Page */
module.exports.renderRegister = (req, res) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if(req.isAuthenticated()){
        res.redirect('/campgrounds')
    } else {
        res.render('users/register')
    }
    
}

/* User Register */
module.exports.register = async (req, res) => {
    try{        
        const {email, username, password} = req.body
        const user = new User({email, username})
        const registeredUser = await User.register(user, password)
        req.login(registeredUser, err => {
            if(err) return next(err)
            req.flash('success','Welcome to Yelp-Camp')
            res.redirect('/campgrounds')
        })
        
    } catch (e){
        req.flash('error', e.message)
        res.redirect('/register')
    }
}

/* Render Login Page */
module.exports.userLogin = (req, res) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    if(req.isAuthenticated()){
         res.redirect('/campgrounds') 
    } else {
        res.render('users/login')
    }
}
  

/* User Login */
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome Back!')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

/* User Logout */
module.exports.logout = (req, res) => {
    req.logout();
    res.redirect('/campgrounds');
  }