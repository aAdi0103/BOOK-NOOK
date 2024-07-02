const mongoose=require('mongoose');
const Joi=require('joi');

const ownerSchema=mongoose.Schema({
    name:{
        type:String,
        minLength:3,
        maxLength:20,
        trim:true,
        required:true
    },
    email:{
        type:String,
        trim:true,
        required:true
    },
    age:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    contact:{
        type:Number,
        required:true,
        minLength:3,

    },
    posts:[
        {
         type:mongoose.Schema.Types.ObjectId,
         ref:'product'
        }
    ],
    address:{
        type:String
    },
    picture:Buffer,
    gstin:Number

})

function validateOwnerModel(data){
    const ownerJoiSchema = Joi.object({
        name: Joi.string()
           .min(3)
           .required(),
  
        email: Joi.string()

           .email({ minDomainSegments: 2 })
           .required()
           .custom((value, helpers) => {
               const domain = value.split('@')[1];
               if (!domain.endsWith('.com') && !domain.endsWith('.net')) {
                   return helpers.error('string.emailDomain');
               }
               return value;
           }),


           contact: Joi.number()
           .min(10)
           .required(),
           
        password: Joi.string()
           .required(),
  
  
    })

    .messages({
        'string.email': 'The email format is incorrect',
        'string.emailDomain': 'Only .com and .net domains are allowed'
    });
  
  let {error}=ownerJoiSchema.validate(data);
  return error;
  }
    
  module.exports.ownerModel=mongoose.model('Owner',ownerSchema);
  module.exports.validateOwnerModel=validateOwnerModel;