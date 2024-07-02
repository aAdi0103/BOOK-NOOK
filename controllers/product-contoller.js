const productModel = require('../models/books-model');

module.exports.createProducts = async function(req, res) {
    try {
        let { price, name, discount, author, genre } = req.body;
        let seller = req.user;
        let book = await productModel.findOne({ name });

        if (book && book.user._id === seller._id) {
            return res.send('Book with the same name already created');
        }

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price,
            discount,
            author,
            genre
        });

        seller.posts.push(product._id);
        product.user.push(seller._id);
        await product.save();
        await seller.save();

        res.redirect('/ownerProfile');
    } 
    catch (err) {
        console.error(err);
        res.send(err.message);
    }
};

