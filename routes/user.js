const express =require('express')
const router=express.Router();
const userController = require('../controllers/userController')



router.get('/',userController.getIndex)
 
router.post('/menuDelete',userController.deleteMenu)

router.post('/itemOrder',userController.orderUpdate)

router.post('/addmenu',userController.addMenu)
router.get('/header',userController.getHeader)

module.exports =router