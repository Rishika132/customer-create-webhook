const Customer = require("../model/customer.model");
const sendEmail =require("../nodemailer");
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

    const existingCustomer = await Customer.findOne({ customer_id: customerId });

    if (existingCustomer) {
      await getCustomerTags(customerId); 
      return res.status(200).json({ message: "Customer already exists. Tags updated." });
    }

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

const WebhookProductUpdate = async (req, res) => {
   const isValid = sendEmail(req);
  if (!isValid) return res.status(401).send('Unauthorized');

  const product = req.body;
  const title = product.title;

  try {
    const customers = await Customer.find({ tags: { $in: [title] } });

    for (const customer of customers) {
      await req.mailer.sendMail({
        from: process.env.EMAIL_FROM,
        to: customer.email,
        subject: `Product Updated: ${title}`,
        text: `Hi ${customer.name}, the product "${title}" has been updated.`,
      });
    }

    res.status(200).send('Webhook processed successfully');
  } catch (err) {
    console.error('Webhook Error:', err);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { WebhookCustomerCreate,WebhookProductUpdate };
