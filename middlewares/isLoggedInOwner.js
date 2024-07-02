const jwt = require('jsonwebtoken');
const {ownerModel,validateOwnerModel} = require('../models/owner-model');

module.exports = async function (req, res, next) {
    if (!req.cookies.tokenOwner) {
        return res.redirect('/');
    }
    try {
        let decoded = jwt.verify(req.cookies.tokenOwner, process.env.JWT_SECRET);
        let user = await ownerModel.findOne({ email: decoded.email }).select("-password");
        req.user = user;
        next();
    } 
    catch (err) {
        // req.flash("error", "something went wrong");
        return res.send(err.message)
    }
};
