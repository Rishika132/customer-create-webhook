const express = require("express");
const router = express.Router();
const { WebhookCustomerCreate } = require("../controller/webhook.controller");
router.post("/webhook/customer/create", WebhookCustomerCreate);

module.exports = router;
