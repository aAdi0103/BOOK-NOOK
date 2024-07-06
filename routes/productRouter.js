const express = require('express');
const router = express.Router();
const upload=require('../config/multer-connection')
const createProductsController = require('../controllers/product-contoller');
const isLoggedInOwner=require('../middlewares/isLoggedInOwner')
const postModel=require('../models/books-model');
const { ownerModel } = require('../models/owner-model');
const isLoggedIn = require('../middlewares/isLoggedIn');


router.get('/createProduct',isLoggedInOwner,async function(req, res) {
    let user = await ownerModel.findOne({email:req.user.email});
        res.render('createProducts',{user});
});


router.post('/create', upload.single('image'),isLoggedInOwner,createProductsController.createProducts);


// edit Post
router.get('/edit/:id', isLoggedInOwner, async function(req, res) {
    try {
        const product = await postModel.findOne({ _id: req.params.id });
        res.render('editProduct.ejs', { product });
    } 
    
    
    catch (err) {
        console.error('Error retrieving product:', err);
        res.status(500).send('Error retrieving product details');
    }
})



// update Post
router.post('/update/:id', isLoggedInOwner, upload.single('image'), async function(req, res) {
    try {
      const productId = req.params.id;
      const { name, author, price, discount, genre } = req.body;
  
      const updatedProduct = await postModel.findByIdAndUpdate(
        productId,
        {
          name,
          author,
          price,
          discount,
          genre,
        },
        { new: true } 
      );
  
      if (!updatedProduct) {
        return res.status(404).send('Product not found');
      }
  
      res.redirect('/ownerProfile');
    } 

    catch (err) {
      res.status(500).send('Error updating product details');
    }
  });


router.get('/delete/:id',async function(req,res){
    let post=await postModel.findOneAndDelete({_id:req.params.id})

   res.redirect('/ownerProfile');
  
  })


module.exports = router;

