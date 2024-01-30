const mongoose =require('mongoose')

const Schema = mongoose.Schema

const itemSchema = new mongoose.Schema({
    name: String,
    url:String,
    order:String,
    children:{String}
  });
  const Item = mongoose.model('Item', itemSchema);

 


module.exports = Item