const express = require('express')
const app = express();
const ejsLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
app.use (bodyParser.urlencoded({extended:false}))

// router 
const adminrouter =require('./routes/admin')
const userrouter = require('./routes/user')

// view engine kısmı
app.set('view engine','ejs')
app.set('views','./views')
app.use(ejsLayouts)
 


const path = require('path')
app.use(express.static(path.join(__dirname, '/public')));
 

app.use('/admin',adminrouter)
app.use('/',userrouter)


app.listen(3000,()=>{
    console.log("proje çalışıyor")
})