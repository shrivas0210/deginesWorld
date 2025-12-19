import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Send verification email
export const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `http://localhost:3000/api/verify-email?token=${token}`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Email Verification',
        html: `
            <h2>Welcome! Please verify your email</h2>
            <p>Click the link below to verify your email address:</p>
            <a href="${verificationUrl}">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Verification email sent to:', email);
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

// Send mobile verification code (placeholder for SMS service)
export const sendMobileVerification = async (mobileNumber, code) => {
    // For SMS, you would integrate with Twilio, AWS SNS, etc.
    // For now, just log it (in production, send actual SMS)
    console.log(`Verification code for ${mobileNumber}: ${code}`);

    // Example with Twilio (uncomment and install twilio):
    // const twilio = require('twilio');
    // const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    // await client.messages.create({
    //     body: `Your verification code is: ${code}`,
    //     from: process.env.TWILIO_PHONE,
    //     to: mobileNumber
    // });
};