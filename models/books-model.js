const mongoose=require('mongoose');

const productSchema=mongoose.Schema({
   user:[{
      type:mongoose.Schema.Types.ObjectId,
      ref:"Owner",
     }],
   image:Buffer,
   price:Number,
   name:String,
   discount:{
    type:Number,
    default:0
   },
   author:String,
   genre:String,

})
module.exports=mongoose.model('product',productSchema);