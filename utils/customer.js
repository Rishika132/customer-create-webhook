const axios = require("axios");
const Customer = require("../model/customer.model"); 
require("dotenv").config();

async function getCustomerTags(customerId) {
  try {
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN;
    const shopifyStore = process.env.SHOPIFY_STORE;

    const query = `
      {
        customer(id: "gid://shopify/Customer/${customerId}") {
          id
          tags
        }
      }
    `;

    const response = await axios.post(
      `https://${shopifyStore}.myshopify.com/admin/api/2024-04/graphql.json`,
      { query },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.data.customer?.tags || [];
  } catch (error) {
    console.error("Shopify Error:", error.response?.data || error.message);
    return null;
  }
}

async function updateAllCustomerTags() {
  try {
    const customers = await Customer.find({ customer_id: { $exists: true } });
    for (const customer of customers) {
      const tags = await getCustomerTags(customer.customer_id);
      if (tags) {
        customer.tags = tags;
        await customer.save();
      }
    }

    console.log(" All customer tags updated.");
  } catch (err) {
    console.error("MongoDB Error:", err);
  }
}
updateAllCustomerTags();
module.exports = { getCustomerTags };