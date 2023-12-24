const express =require('express')
const router  =express.Router();




router.get('/',(req,res)=>{
   res.render('admin/index',{layout:'admin/layouts/layout'})
})
 

module.exports = router