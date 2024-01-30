const express = require('express')
const app = express();
const ejsLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
app.use (bodyParser.urlencoded({extended:false}))
const mongoose = require('mongoose')
 
 
// router 
 const userrouter = require('./routes/user')

// view engine kısmı
app.set('view engine','ejs')
app.set('views','./views')
app.use(ejsLayouts)
 
const Item = require('./models/menu')

app.use(express.json());

const path = require('path')
app.use(express.static(path.join(__dirname, '/public')));
 
 


mongoose.connect('mongodb://127.0.0.1:27017/hodox');
const db = mongoose.connection;
db.on("error", console.error.bind(console, "veri tabanı hatası"))
db.once("open", () => {
    console.log('bağlantı başarılı')
})


 
  app.get('/items', async (req, res) => {
    try {
        const items = await Item.find().sort({ order: 1 });
      res.json(items);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
    }
  });
  app.post('/items',   (req, res) => {
     
      const newItem = new Item({ name: req.body.name ,url: req.body.url,order:req.body.order});
      newItem.save()
      .then(result=> {
        res.redirect('/')
      });
 
  });
  app.put('/items/updateOrder', async (req, res) => {
    try {
      const updatedItems = req.body.items;
  
      for (const updatedItem of updatedItems) {
        await Item.findByIdAndUpdate(updatedItem._id, { $set: { order: updatedItem.order } });
      }
  
      res.json({ message: 'Sıralama değerleri güncellendi.' });
    } catch (error) {
      console.error('Sıralama değeri güncelleme hatası:', error);
      res.status(500).json({ error: 'Sıralama değeri güncelleme hatası' });
    }
  });



 app.use('/',userrouter)


app.listen(3000,()=>{
    console.log("proje çalışıyor")
})