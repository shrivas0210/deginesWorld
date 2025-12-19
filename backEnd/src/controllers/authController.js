import userModel from "../modules/User.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationEmail, sendMobileVerification } from "../utils/emailService.js";

const authController = {};

authController.registration = async (req, res) => {
    try {
        const postData = req.body;
        let newEmail = postData?.email?.trim().toLowerCase();
        let existingEmail = await userModel.findOne({ email: newEmail });
        if (existingEmail) {
            return res.status(400).json({ status: "error", message: "Email Address Already Exists, try Another or Login" });
        }

        let newPassword = await bcrypt.hash(postData?.password, 10);

        // Generate email verification token
        const emailToken = crypto.randomBytes(32).toString('hex');
        const emailTokenExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        // Generate mobile verification code
        const mobileCode = Math.floor(100000 + Math.random() * 900000).toString();
        const mobileCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        let formData = {
            full_name: postData?.full_name,
            email: newEmail,
            password: newPassword,
            profilePicture: postData?.profilePicture,
            mobileNumber: postData?.mobileNumber,
            address: postData?.address,
            country: postData?.country,
            state: postData?.state,
            city: postData?.city,
            emailVerificationToken: emailToken,
            emailVerificationExpires: emailTokenExpires,
            mobileVerificationCode: mobileCode,
            mobileVerificationExpires: mobileCodeExpires
        };

        let user = await userModel.create(formData);

        // Send verification email
        try {
            await sendVerificationEmail(newEmail, emailToken);
        } catch (emailError) {
            console.log('Email sending failed:', emailError);
        }

        // Send mobile verification (if mobile number provided)
        if (postData?.mobileNumber) {
            try {
                await sendMobileVerification(postData.mobileNumber, mobileCode);
            } catch (mobileError) {
                console.log('Mobile verification failed:', mobileError);
            }
        }

        res.status(201).json({
            status: "success",
            message: "User registered successfully. Please check your email and mobile for verification codes.",
            user: {
                id: user._id,
                full_name: user.full_name,
                email: user.email,
                mobileNumber: user.mobileNumber
            }
        });

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Email verification endpoint
authController.verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        const user = await userModel.findOne({
            emailVerificationToken: token,
            emailVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid or expired verification token" });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpires = undefined;
        await user.save();

        res.json({ status: "success", message: "Email verified successfully" });

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

// Mobile verification endpoint
authController.verifyMobile = async (req, res) => {
    try {
        const { mobileNumber, code } = req.body;

        const user = await userModel.findOne({
            mobileNumber: mobileNumber,
            mobileVerificationCode: code,
            mobileVerificationExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ status: "error", message: "Invalid or expired verification code" });
        }

        user.isMobileVerified = true;
        user.mobileVerificationCode = undefined;
        user.mobileVerificationExpires = undefined;
        await user.save();

        res.json({ status: "success", message: "Mobile number verified successfully" });

    } catch (error) {
        console.log('error: ', error);
        res.status(500).json({ status: "error", message: "Internal server error" });
    }
};

export default authController;