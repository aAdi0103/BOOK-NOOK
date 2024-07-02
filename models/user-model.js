const mongoose=require('mongoose');
const Joi=require('joi')

const userSchema=mongoose.Schema({
    name:{
      required:true,
      type:String,
      trim:true
    },
    contact:{
         type:Number,
         trim:true
    },
    address:{
      type:String,
      trim:true
    },
    age:{
      type:Number,
    },
    password:{
        required:true,
        type:String,
        select:true
    },
    cart:[
      {
       type:mongoose.Schema.Types.ObjectId,
       ref:'product'
      }
  ],
    email:{
      required:true,
      trim:true,
      type:String
    },
    
    profilePic:Buffer
  
})

function validateUserModel(data){
  const userJoiSchema = Joi.object({
      name: Joi.string()
         .min(3)
         .required(),
    age:Joi.number(),
       contact:Joi.number(),
       address:Joi.string(),
       gender:Joi.string()
       .valid('male', 'female', 'other'),
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
         
      password: Joi.string()
         .required(),


  })
  .messages({
      'string.email': 'The email format is incorrect',
      'string.emailDomain': 'Only .com and .net domains are allowed'
  });

let {error}=userJoiSchema.validate(data);
return error;
}
  

module.exports.userModel=mongoose.model('user',userSchema);
module.exports.validateUserModel=validateUserModel;