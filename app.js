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
console.log(' MongoDB connected');
app.use("/api", customerWebhookRoutes);
        app.listen(3000, () => {
            console.log("Server started...");
        })
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });