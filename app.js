const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")
const customerWebhookRoutes = require("./routes/webhook.route");
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)

    .then(() => {
console.log('✅ MongoDB connected');
app.use("/api", customerWebhookRoutes);
        app.listen(3000, () => {
            console.log("Server started on port 3000");
        })
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });

// const express = require('express');
// const cors = require('cors');
// const axios = require('axios');
// const mongoose = require('mongoose');
// require('dotenv').config();
 
// const app = express();
 
// app.use(cors({ origin: 'https://*.myshopify.com' }));
// app.use(express.json());
 
// // Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URI)
//     .then(() => console.log('✅ MongoDB connected'))
//     .catch(err => console.error('❌ MongoDB connection error:', err));
 
 
// // MongoDB model
// const CustomerSchema = new mongoose.Schema({
//     email: String,
//     productTitle: String,
//     createdAt: { type: Date, default: Date.now }
// });
// const Customer = mongoose.model("Customer", CustomerSchema);
// app.post('/save-customer', async (req, res) => {
//     console.log(req)
//     try {
//         const { email, productTitle } = req.body;
 
//         if (!email || !productTitle) {
//             return res.status(400).json({ error: "Missing required fields" });
//         }
 
//         const customerData = new Customer({
//             email,
//             productTitle
//         });
//         await customerData.save();
 
//         res.json({ message: "Customer data saved successfully" });
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ error: "Server error" });
//     }
// });
 
 
// // Start server
// app.listen(8080, () => {
//     console.log('🚀 Server running on port 8080');
// });