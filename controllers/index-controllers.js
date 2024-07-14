const {userModel,validateUserModel}=require('../models/user-model')
const {validateOwnerModel,ownerModel}=require('../models/owner-model');

const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const booksModel = require('../models/books-model');

module.exports.landingPageController= function(req,res){
    res.render('index');
}



// user

module.exports.register=function(req,res){
    res.render('register')
}


module.exports.createUser=async function(req,res){


    try{
        let {name,email,password}=req.body;

        let error=validateUserModel({name,email,password});
        if(error) return res.send(error.message);

    let user= await userModel.findOne({email});
    if(user) return res.send('already registered');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let createdUser= await userModel.create({
          name,
          email,
          password:hash
    })

    let token = jwt.sign(
        { email, id: createdUser._id }, // it means we want to put our email and id in our token

        process.env.JWT_SECRET
    );

    res.cookie('token', token);
    res.redirect('/profile');
    }


    catch(error){
        res.send(error.message);
    }

}


module.exports.loginUser = async function (req, res) {
    try {
        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.send("Account not found");
        }

        bcrypt.compare(password, user.password, function (err, result) {
            if (err) {
                return res.send("Error during password comparison");
            }

            if (result) {
                let token = jwt.sign(
                    { email, id: user._id },
                    process.env.JWT_SECRET,
                );

                res.cookie('token', token)
                return res.redirect('/profile');

            } 
            
            else {
                return res.send("Incorrect password");
            }

        });
    } 
    
    catch (error) {
        return res.status(500).send(error.message);
    }
};



// Seller

module.exports.registerSeller=function(req,res){
    res.render('registerSeller')
}

module.exports.createSeller=async function(req,res){

 try{
        let {name,email,contact,password}=req.body;

        let error=validateOwnerModel({name,email,password,contact});
        if(error) return res.send(error.message);

    let user= await ownerModel.findOne({email});
    if(user) return res.send('already registered');

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    let createdOwner= await ownerModel.create({
          name,
          email,
          contact,
          password:hash
    })

    let tokenOwner = jwt.sign(
        { email, id: ownerModel._id }, // it means we want to put our email and id in our token

        process.env.JWT_SECRET
    );

    res.cookie('tokenOwner', tokenOwner);
  res.redirect('/ownerProfile')
}


    catch(error){
        res.send(error.message);
    }

}


module.exports.loginSeller = async function (req, res) {
    try {
        const { email, password } = req.body;

        const owner = await ownerModel.findOne({ email });

        if (!owner) {
            return res.send("Account not found");
        }

        bcrypt.compare(password, owner.password, function (err, result) {
            if (err) {
                return res.send("Error during password comparison");
            }

            if (result) {
                let tokenOwner = jwt.sign(
                    { email, id: owner._id },
                    process.env.JWT_SECRET,
                );

                res.cookie('tokenOwner', tokenOwner)
                return res.redirect('/ownerProfile');

            } 
            
            else {
                return res.send("Incorrect password");
            }

        });
    } 
    
    catch (error) {
        return res.status(500).send(error.message);
    }
};


module.exports.searchBooks = async function (req, res) {
    try {
        const { query } = req.query;
        const searchRegex = new RegExp(query, 'i');  // 'i' makes search insensetive
        // A regular expression RegExp object is used for pattern matching in strings
        const books = await booksModel.find({ 
            $or: [ // $or is used to show products if ony of one mathches name,genre,author if onyone gets true it will show
                { name: searchRegex },
                { author: searchRegex },
                { genre: searchRegex }
            ] 
        });

        res.render('searchResults', { books });
    } 
    catch (error) {
        res.status(500).send(error.message);
    }
};



// module.exports.searchBookOwner = async function (req, res) {
//     try {
//         const { query } = req.query;
//         const searchRegex = new RegExp(query, 'i'); // Case insensitive search

//         // Step 1: Find products that match the search criteria
//         const matchingProducts = await booksModel.find({
//             $or: [
//                 { name: searchRegex },
//                 { author: searchRegex },
//                 { genre: searchRegex }
//             ]
//         });

//         // Step 2: Filter matching products that are in any owner's posts
//         const filteredBooks = await productsModel.find({
//             _id: { $in: matchingProducts.map(product => product._id) }
//         });

//         // Render results
//         res.render('searchResultsBooks', { books: filteredBooks });
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// };



module.exports.logoutUser=function(req,res){
    res.cookie('token','');
    res.redirect('/')
}

module.exports.logoutOwner=function(req,res){
    res.cookie('tokenOwner','');
    res.redirect('/')
}
