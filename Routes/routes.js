const express=require('express')

const testController=require('../Controllers/testController')

const router=express.Router()

router.get("/webhook", webhookController.verifyWebhook);
router.post("/webhook", webhookController.receiveMessage);

router.post('/send-message',testController.startMessage)


module.exports=router