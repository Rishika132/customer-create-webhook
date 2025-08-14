const Customer = require("../model/customer.model");
const getCustomerTags = require("../utils/customer");

const WebhookCustomerCreate = async (req, res) => {
  try {
    const customer = req.body;
    const customerId = customer.id;
    const email = customer.email;
    const tagsString = customer.tags || "";
    const tagsArray = tagsString.split(",").map(tag => tag.trim());

    const storeName = req.headers["x-shopify-shop-domain"] || null;

    if (!customerId || !email) {
      return res.status(400).json({ error: "Missing required customer fields" });
    }

    // const existingCustomer = await Customer.findOne({ customer_id: customerId });

    // if (existingCustomer) {
    //   await getCustomerTags(customerId); 
    //   return res.status(200).json({ message: "Customer already exists. Tags updated." });
    // }

    const newCustomer = new Customer({
      customer_id: customerId,
      email,
      tags: tagsArray,
      store_name: storeName,
    });

    const savedCustomer = await newCustomer.save();

    await getCustomerTags(customerId); 
    return res.status(200).json({ message: "Customer synced", customer: savedCustomer });
  } catch (err) {
    console.error("Customer Webhook Error:", err.message);
    return res.status(500).json({ error: "Failed to handle customer webhook" });
  }
};

module.exports = { WebhookCustomerCreate };
