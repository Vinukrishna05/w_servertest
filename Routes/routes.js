const express=require('express')

const webHookController = require("../Controllers/webhookController");


const router=express.Router()

router.get("/webhook", webHookController.verifyWebhook);
router.post("/webhook", webHookController.receiveMessage);



module.exports=router