const crypto = require('crypto');

module.exports = function sendEmail(req) {
  const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
  const generatedHmac = crypto
    .createHmac('sha256', process.env.SHOPIFY_API_SECRET)
    .update(req.rawBody, 'utf8')
    .digest('base64');

  return hmacHeader === generatedHmac;
};
