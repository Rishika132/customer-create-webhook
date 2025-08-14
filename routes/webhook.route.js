const express = require("express");
const router = express.Router();
const { WebhookCustomerCreate ,WebhookProductUpdate } = require("../controller/webhook.controller");
router.post("/webhook/customer/create", WebhookCustomerCreate);
router.post("/webhook/product/update", WebhookProductUpdate);
module.exports = router;
