import mongoose, { mongo, Schema } from "mongoose";


const OTPSchema= new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"]
    },
    otpHashed:{
        type:String,
        required:[true,"Hashed otp is required"]
    },

},{timestamps:true})

const otp= mongoose.models.OTPSchema || mongoose.model("otps", OTPSchema)

export default otp;