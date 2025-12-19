import mongoose, { model, Schema } from "mongoose";

const userSchemaModel = new Schema({
    full_name: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    password: { type: String, required: true, index: true },
    profilePicture: { type: String },
    mobileNumber: { type: Number },
    address: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    emailVerificationExpires: { type: Date },
    isMobileVerified: { type: Boolean, default: false },
    mobileVerificationCode: { type: String },
    mobileVerificationExpires: { type: Date }
}, {
    timestamps: true
});

const userModel = model("user", userSchemaModel);
export default userModel;

