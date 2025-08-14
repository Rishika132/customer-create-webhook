const nodemailer = require ("nodemailer");
const dotenv = require ("dotenv");
dotenv.config();

const sendEmail = (to, subject,html) => {
    return new Promise((resolve, reject) => {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_ID,
                pass: process.env.GMAIL_PASSWORD
            }
        });

        let mailOptions = {
            from: process.env.GMAIL_ID,
            to,
            subject,
            html
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(false);
            } else {
                resolve(true);
            }
        });
    });
}
module.exports =  sendEmail ;
