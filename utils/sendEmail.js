const nodemailer = require('nodemailer');

const sendEmail = async (email, token) => {
    // We use ethereal email for testing purposes. 
    // In production, you would use Gmail, Sendgrid, etc.
    // For this mission, let's use a standard Gmail SMTP setup (you can replace with your own).
    // Note: To use Gmail, you need an "App Password" from your Google Account.
    
    // Create a test account just for testing if no credentials are provided
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email", // Ethereal is a fake SMTP service for testing
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    const verificationLink = `http://localhost:3000/auth/verifikasi-email/${token}`;

    const mailOptions = {
        from: '"Movie App" <no-reply@movieapp.com>', // sender address
        to: email, // list of receivers
        subject: "Email Verification - Movie App", // Subject line
        text: `Please verify your email by clicking on the following link: ${verificationLink}`, // plain text body
        html: `<p>Please verify your email by clicking on the following link:</p><p><a href="${verificationLink}">${verificationLink}</a></p>`, // html body
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
    return nodemailer.getTestMessageUrl(info); // Return the preview URL so we can see it in terminal
};

module.exports = sendEmail;
