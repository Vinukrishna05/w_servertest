const express=require('express')

// const testController=require('../Controllers/testController')
const webhookController = require("../Controllers/webhookController");


const router=express.Router()

// router.get("/webhook", testController.verifyWebhook);
// router.post("/webhook", testController.receiveMessage);

router.get("/webhook", webhookController.verifyWebhook);
router.post("/webhook", webhookController.receiveMessage);



module.exports=router