import uploadOnCloudinary from "../config/cloudinary.js";
import { generateToken } from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt, { compare } from "bcryptjs";

// user signUp
export const signUp = async (req, res) => {
  try {
    let { firstName, lastName, userName, email, password } = req.body;
    if (!firstName || !lastName || !userName || !email || !password) {
      return res.status(400).json({ message: "All fields are required !" });
    }

    // Like req.body, req.file(a property) is added by Multer middleware in request and stores information about the uploaded file.
    // console.log(req.file);
    let profileImage;
    // sending img path to cloudinary 
    if(req.file){
      profileImage= await uploadOnCloudinary(req.file.path)
    }
    // searching a user is exists or not by email and username
    let existUseremail = await User.findOne({ email });
    if (existUseremail) {
      return res
        .status(400)
        .json({ message: " this email is already registered" });
    }
    let existUserName = await User.findOne({ userName });
    if (existUserName) {
      return res
        .status(400)
        .json({ message: " this user name is already registered try another" });
    }

    // password hashing
    let hashedPassword = await bcrypt.hash(password, 10);
    // 10 = includes 10 digits in password

    let newUser = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password: hashedPassword,
      profileImage,
    });

    // creating a token based on the specific id which mongo creates
    let token = generateToken(newUser._id);

    //  Set one cookie in the response named token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // "token": cookie name
    // httpOnly: true → JavaScript in the browser cannot access the cookie (document.cookie can't read it). This helps prevent XSS attacks.
    // secure: When secure= true, the browser sends the cookie only over HTTPS. When secure= false, the cookie can be sent over both HTTP and HTTPS.
    // sameSite: "strict" → Browser sends the cookie only for requests from the same site, helping protect against CSRF attacks.
    // maxAge: cookie expiry date (time is in milliseconds).

    return res.status(201).json({
      firstName,
      lastName,
      userName,
      email,
      profileImage,
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

// user login
export const login = async (req, res) => {
  try {
    let { email, password } = req.body;
    let existUser = await User.findOne({ email });
    if (!existUser) {
      return res.status(400).json({ message: "The user is not exists" });
    }
    // compare with the hashed password , bcrypt.compare returns a promise
    let matchPassword = await bcrypt.compare(password, existUser.password);
    if (!matchPassword) {
      return res.status(400).json({ message: "incorrect password " });
    }
    // create token
    let token = generateToken(existUser._id);
   
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      firstName: existUser.firstName,
      lastName: existUser.lastName,
      userName: existUser.userName,
      email: existUser.email,
      profileImage: existUser.profileImage,
    });
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
};


// user logout
export const logOut= async(req,res)=>{
  try {
    // clear the token cookies
    res.clearCookie("token")
    return res.status(200).json({message:"User successfully log-out"})
    
  } catch (error) {
    return res.status(500).json(error);
    
  }
}

// automatic token based login 
 export const getUserData= async(req,res)=>{
  try {
    let userId= req.userId
    if(!userId){
      return res.status(400).json({message:"user Id is not found"})
    }
    // fetching the user by the id 
    let user = await User.findById(userId)
    if(!user){
      return res.status(400).json({message:"user is not found"})
    }

    return res.status(200).json({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      profileImage: user.profileImage,
    })
  } catch (error) {
    return res.status(500).json(error)
    
  }
 }