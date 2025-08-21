const express=require('express')

const testController=require('../Controllers/testController')

const router=express.Router()



router.post('/send-message',testController.startMessage)


module.exports=router