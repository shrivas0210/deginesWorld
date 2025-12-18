import mongoose, { model, Schema } from "mongoose";

const userSchemaModel = new Schema({
    full_name : {type : String, required : true, index : true},
    email : {type : String, required : true, index : true},
    password : {type: String, required : true, index : true},
    profilePicture : {type : String, required : true, index: true},
    mobileNumber : {type :Number, required : true, index : true},
    address : {type: String, required : true, index : true},
    country : {type: String, required : true, index : true},
    state : {type: String, required : true, index : true},
    city : {type: String, required : true, index : true}
})

const userModel = model("user",userSchemaModel)
export default userModel;

