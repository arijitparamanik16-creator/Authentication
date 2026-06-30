import {v2 as cloudinary} from "cloudinary"
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,

})

// uploading the img path to cloudinary 
const uploadOnCloudinary= async(filePath)=>{
    try {
        if(!filePath){
            return null
        }
        let result=await cloudinary.uploader.upload(filePath)
        // console.log(result);
        // after uploading img to the cloud delete it from local storage 
        fs.unlinkSync(filePath)
        // taking the url from result 
        return result.secure_url
        
    } catch (error) {
        fs.unlinkSync(filePath)
        console.log(error);
        
        
    }
}

export default uploadOnCloudinary;