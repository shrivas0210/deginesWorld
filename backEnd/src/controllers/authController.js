import userModel from "../modules/User";
import bcrypt from "bcrypt";

const authController = {};

authController.registration = async(req, res)=>{
try {
    const postData = req.body;
    let newEmail = postData?.email.trim().toLowercase();
    let exestingEmail = await userModel.find({ email: newEmail }).lean();
    if (exestingEmail.length) {
        return res.status(400).json({ status: "error", message: "Email Address Already Exest try Another or Login" })
    }
    let newPassword = bcrypt.hash(postData?.password)

    let formData = {
        full_name: postData?.full_name,
        email: postData?.email,
        password: postData?.password,
        profilePicture: postData?.profilePicture,
        mobileNumber: postData?.mobileNumber,
        address: postData?.address,
        country: postData?.country,
        state: postData?.state,
        city: postData?.city
    };

    let user = await userModel.create({formData})
    
} catch (error) {
    console.log('error: ', error);    
}
}