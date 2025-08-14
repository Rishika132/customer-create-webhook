const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors")
const nodemailer = require("nodemailer");
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
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_FROM,
                pass: process.env.EMAIL_PASS,
            },
        });

        app.use(bodyParser.json({
            verify: (req, res, buf) => { req.rawBody = buf; }
        }));

        // Attach transporter to request for controller use
        app.use((req, res, next) => {
            req.mailer = transporter;
            next();
        });
        app.use("/api", customerWebhookRoutes);
        app.listen(3000, () => {
            console.log("Server started...");
        })
    })
    .catch((err) => {
        console.error("Failed to connect to MongoDB", err);
    });