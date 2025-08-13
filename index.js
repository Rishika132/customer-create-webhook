//Frontend--------------------------
 
 
const express = require('express');
const crypto = require('crypto');
const mongoose = require('mongoose');
const cors = require('cors');
 
const app = express();
 
app.use(cors({
    origin: "*", // sab origin allow (testing ke liye)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
}));
// MongoDB connection
mongoose.connect("mongodb+srv://anshulitg:anshul123456@floorcraft.vho5ety.mongodb.net/taskdb")
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));
 
const CustomerSchema = new mongoose.Schema({
    shopifyId: String,
    email: String,
    firstName: String,
    lastName: String,
    createdAt: Date,
});
const Customer = mongoose.model('Customer', CustomerSchema);
 
// Shopify webhook secret
const SHOPIFY_WEBHOOK_SECRET = 'your_shopify_webhook_secret_here';
 
// Webhook route — raw body parsing & verification
app.use('/webhook/customers_create', express.raw({ type: 'application/json' }));
 
function verifyShopifyWebhook(req) {
    const hmacHeader = req.headers['x-shopify-hmac-sha256'];
    const rawBody = req.body.toString('utf8');
    const hash = crypto.createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
        .update(rawBody, 'utf8')
        .digest('base64');
    return hash === hmacHeader;
}
 
app.post('/webhook/customers_create', async (req, res) => {
    console.log(req , "idddd")
    if (!verifyShopifyWebhook(req)) {
        return res.status(401).send('Unauthorized');
    }
 
    try {
        const customer = JSON.parse(req.body.toString());
 
        const newCustomer = new Customer({
            shopifyId: customer.id,
            email: customer.email,
            firstName: customer.first_name,
            lastName: customer.last_name,
            createdAt: new Date(customer.created_at),
        });
 
        await newCustomer.save();
 
        console.log('Webhook customer saved:', newCustomer);
 
        res.status(200).send('Webhook processed');
    } catch (err) {
        console.error('Webhook error:', err);
        res.status(500).send('Server error');
    }
});
 
// JSON body parser for frontend form submit
app.use(express.json());
 
// Frontend API route for saving customer (optional)
app.post('/api/save-customer', async (req, res) => {
    console.log(req)
    try {
        const { customerId, email, productTitle } = req.body;
 
        if (!email || !productTitle) {
            return res.status(400).json({ error: 'Email and productTitle are required' });
        }
 
        const newCustomer = new Customer({
            shopifyId: customerId || '',
            email,
            productTitle,
            createdAt: new Date(),
        });
 
        await newCustomer.save();
 
        res.json({ message: 'Customer saved from frontend form' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});
 
app.listen(8080, () => {
    console.log('Server running on http://localhost:8080');
});
 
 