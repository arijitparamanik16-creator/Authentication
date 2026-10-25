import mongoose, { mongo, Schema } from "mongoose";


// for identifying a single user's multiple devices 

const sessionSchema= new Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"User is required"]
    },
    refreshTokenHash:{
        type:String,
        required:[true,"Refresh token hash is required"]
    },
    ip:{
        type:String,
        required:[true,"IP address is required"]
    },
    // for understanding user uses which typeOf browser 
    userAgent:{
        type:String,
        required:[true,"Usre Agent is required"]
    },
    //if true then cleared the refresh token
    revoked:{
        type:Boolean,
        default:false

    }
},{timestamps:true})

const session= mongoose.models.sessionModel || mongoose.model("sessions", sessionSchema)

export default session;