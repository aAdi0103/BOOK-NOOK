const jwt = require('jsonwebtoken');
const userModel=require('../models/user-model')
module.exports.redirectIfLoggedIn = async function (req, res, next) {
    
if(req.cookies.token){
    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
        let user = await userModel.findOne({ email: decoded.email }).select("-password");
        req.user = user;
        res.redirect('/profile')
    } 

    catch (err) {
        return next();
    }
   
}

else {
    return next();
}
};
