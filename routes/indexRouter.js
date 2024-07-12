const express=require('express');
const router=express.Router();
const {landingPageController,register,registerSeller,createUser,createSeller,loginUser,logoutUser,loginSeller,logoutOwner}=require('../controllers/index-controllers')
const isLoggedIn = require('../middlewares/isLoggedIn');
const isLoggedInOwner=require('../middlewares/isLoggedInOwner')
const {userModel,validateModel}=require('../models/user-model');
const { ownerModel } = require('../models/owner-model');
const productModel=require('../models/books-model');
const upload = require('../config/multer-connection');


// User
router.get('/',landingPageController)
router.get('/register',register)

router.post('/create',createUser)


router.post('/login',loginUser);

router.get('/logout',logoutUser);

router.get('/profile',isLoggedIn,async function(req,res){
    try{let user = await userModel.findOne({email:req.user.email});
    // console.log(user);
    let products= await productModel.find();
    res.render('profile',{user,products});}
    catch(err){
        res.send(err.message);
    }
})

// Profile Details Update
router.get('/profile/update',isLoggedIn,async function(req,res){
   try{ let user=await userModel.findOne({email:req.user.email});
    res.render('updateprofile',{user})}
    catch(err){
        res.send(err.message);
    }
})

// update profile

router.post('/profile/update/:id', isLoggedIn, upload.single('image'), async function(req, res) {
    try {
        const { name, email, age, address, contact } = req.body;
        const profilePic = req.file ? req.file.buffer : undefined;

        const updatedUser = await userModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                name,
                age,
                address,
                email,
                contact,
                profilePic: profilePic 
            },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send('User not found');
        }
  
              res.redirect('/profile');

    } 
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});









// Owner
 
router.get('/registerSeller',registerSeller)
router.post('/createSeller',createSeller)
router.get('/ownerProfile',isLoggedInOwner,async function(req,res){
   try{ let products=await productModel.find();
    let user = await ownerModel.findOne({email:req.user.email}).populate('posts');
    res.render('ownerProfile',{user,products});}
    catch(err){
        res.send(err.message);
    }
})
router.get('/ownerProfile/update',isLoggedInOwner,async function(req,res){
  try{  let owner=await ownerModel.findOne({email:req.user.email});
    res.render('updateOwnerProfile',{owner})}
    catch(err){
        res.send(err.message);
    }
})



router.post('/ownerProfile/update/:id', isLoggedInOwner, upload.single('image'), async function(req, res) {
    try {
        const { name, email, age, address, contact,gstin } = req.body;
        const profilePic = req.file ? req.file.buffer : undefined;

        const updatedOwner = await ownerModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                name,
                age,
                address,
                email,
                contact,
                gstin,
                picture: profilePic 
            },
            { new: true }
        );

        if (!updatedOwner) {
            return res.status(404).send('User not found');
        }
  
              res.redirect('/ownerProfile');

    } 
    catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }

});



router.post('/loginSeller',loginSeller);
router.get('/logoutOwner',logoutOwner)




// add to cart

router.get('/profile/:id', isLoggedIn, async function(req, res) {
    try {
        let user = await userModel.findOne({_id: req.user._id}).populate('cart');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.render('addToCart',{user});
    } 
    
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/addtocart/:productid',isLoggedIn,async function(req,res){
    let user=await userModel.findOne({email:req.user.email});
    let pro=req.params.productid;
    if(!user.cart.includes(pro)){
        user.cart.push(req.params.productid);
        await user.save()
    }
   
    res.redirect('/profile');
})

router.get('/delete/:id', isLoggedIn, async function(req, res) {
    let user = await userModel.findOne({ email: req.user.email });
    user.cart = user.cart.filter(function(item) {
      return item._id.toString() !== req.params.id; // returns a array after passing condition
    });
    await user.save();
    res.redirect('back');
  })



module.exports=router
