const express=require('express');
const app=express();
const path=require('path')
const Joi=require('joi')
// const crypto=require('crypto');

// mongoose-connection part
require('dotenv').config();
const db=require('./config/mongoose-connection')

// views part
app.set('view engine','ejs');
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));


const cookieParser = require('cookie-parser');
app.use(cookieParser());


const indexRouter=require('./routes/indexRouter')
const productRouter=require('./routes/productRouter')

app.use('/',indexRouter);
app.use('/products',productRouter)

app.listen(process.env.PORT||3000);
