const Item = require('../models/menu')
 
module.exports.getIndex = (req,res) =>{
    res.render('user/index',{layout: 'user/layouts/layout'})

}



module.exports.deleteMenu =(req,res)=>{
    const id = req.body.id
    console.log('id',id)
    Item.deleteOne({_id:id})
    .then(item=>{
       console.log('menü silindi')
       res.redirect('/')
     })

    
}

module.exports.orderUpdate = (req,res) =>{
    const  sira = req.body.order
    console.log('sira',sira)
}


module.exports.addMenu = (req,res) =>{
    const name = req.body.name;
    const url = req.body.url

    const menu = new Item({
        name:name,
        url:url
    })
    menu.save().then(result=>{
        res.redirect('/')
    })
    
}

module.exports.getHeader = (req,res) =>{
    Item.find().sort({order:1})
    .then(Item=>{
        res.render('user/header',{layout: false,Item})
    })
  
}