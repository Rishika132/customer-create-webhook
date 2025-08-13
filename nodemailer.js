const nodemailer = require ("nodemailer");
const dotenv = require ("dotenv");
dotenv.config();

const sendEmail = (toEmail) => {
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
            to: toEmail,
            subject: 'Account Verification',
            html: `<h4>Dear user</h4>
        <p>Thank you to visit us</p>
        <p><b>Link on below button to verify account</b></p>
        <p>
          <input type="hidden" value="${toEmail}" name="email"/>
          <button type="submit" style="background-color:mediumseagreen;width:200px;height:60px;color:white;">Verify</button>
         </form>
        </p>
        <h6>Thanks</h6>
        <b>Backend Api Team</b>`
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
module.exports = { sendEmail };
