const axios = require("axios");

async function getCustomerData(customerId) {
  try {
    const shopifyDomain = process.env.SHOPIFY_STORE; 
    const accessToken = process.env.SHOPIFY_ACCESS_TOKEN; 

    const query = `
      {
        customer(id: "gid://shopify/Customer/${customerId}") {
          id
          email
          tags
        }
      }
    `;

    const response = await axios.post(
      `https://${shopifyDomain}.myshopify.com/admin/api/2024-04/graphql.json`,
      { query },
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data.customer;
  } catch (error) {
    console.error("Error fetching customer:", error.response?.data || error.message);
    return null;
  }
}

// Example usage
(async () => {
  const customer = await getCustomerData("1234567890");
  console.log(customer);
})();
