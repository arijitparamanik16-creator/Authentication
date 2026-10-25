import uploadOnCloudinary from "../config/cloudinary.js";
import { generateAccessToken, generateRefreshToken } from "../config/token.js";
import Session from "../models/session.model.js";
import User from "../models/user.model.js";
import { generateOTP, getOtpHtml } from "../utils/generateOTP.js";
import { sendEmail } from "../services/service.js";
import OTP from "../models/otp.model.js";
import bcrypt, { compare } from "bcryptjs";
import crypto from "crypto";

// bcrypt as a machine that only looks at the first 72 characters of whatever you give it and ignores everything after that. The first part of it (the header and your user id) is the same for every login of the same user. The part that makes each token different comes after that, so bcrypt never saw it. Why crypto (SHA-256) works: it reads the whole token, start to end. So the two tokens give two completely different hashes, and findOne({ refreshTokenHash }) finds exactly one session: the right one.

// so for password hashing use -> bcrypt  and for token hashing use -> crypto *********************************************

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

    if (req.file) {
      profileImage = await uploadOnCloudinary(req.file.path);
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

    // generating otp 
    const otp = generateOTP();
    const html = getOtpHtml(otp);

    const otpHashed = crypto.createHash("sha256").update(otp).digest("hex");
    await OTP.create({
      email,
      user: newUser._id,
      otpHashed,
    });

    await sendEmail(email, "OTP Verification", `Your OTP code is ${otp}`, html);

    return res.status(201).json({
      message: "user registered successfully",
      user: {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userName: newUser.userName,
        email: newUser.email,
        profileImage: newUser.profileImage,
        verified: newUser.verified,
      },
    });
  } catch (error) {
    console.log(1);
    
    return res.status(500).json({ message: error.message });
  }
};

//Refresh Token API endpoint (to generate access token)
export const refreshToken = async (req, res) => {
  try {
    const userID = req.userId;
    if (!userID) {
      return res.status(400).json({
        message: "user not found",
      });
    }

    // finding the sessionId using refreshToken
    let RefreshToken = req.cookies.refreshToken;
    let refreshTokenHash = crypto
      .createHash("sha256")
      .update(RefreshToken)
      .digest("hex");

    const session = await Session.findOne({
      refreshTokenHash,
      revoked: false,
    });

    if (!session) {
      return res.status(401).json({
        message: "Invalid refresh token",
      });
    }
    // IF INVALID REFRESH TOKEN THEN REMOVE IT
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT === "production",
      sameSite: "strict",
    });

    // Rotating the refresh token each time it’s used limits the value of a stolen token: after it’s exchanged, the old one is invalid, so reuse can be detected and the session revoked, so creating a new refresh token
    let newRefreshToken = generateRefreshToken(userID);
    let new_refreshTokenHash = crypto
      .createHash("sha256")
      .update(newRefreshToken)
      .digest("hex");

    session.refreshTokenHash = new_refreshTokenHash;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // "token": cookie name
    // httpOnly: true → JavaScript in the browser cannot access the cookie (document.cookie can't read it). This helps prevent XSS attacks.
    // secure: When secure= true, the browser sends the cookie only over HTTPS. When secure= false, the cookie can be sent over both HTTP and HTTPS.
    // sameSite: "strict" → Browser sends the cookie only for requests from the same site, helping protect against CSRF attacks.
    // maxAge: cookie expiry date (time is in milliseconds).

    let AccessToken = generateAccessToken(userID, session._id);
    return res.status(200).json({
      message: "New access token is generated",
      AccessToken,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
};

// // user login
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

    // email verification
    if (!existUser.verified) {
      return res.status(401).json({
        message: "Email not verified",
      });
    }
    // genrate refresh token
    let RefreshToken = generateRefreshToken(existUser._id);

    //  Set one cookie in the response named token will store in cookies
    res.cookie("refreshToken", RefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT == "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    let refreshTokenHash = crypto
      .createHash("sha256")
      .update(RefreshToken)
      .digest("hex");

    // creating session
    const session = await Session.create({
      user: existUser._id,
      refreshTokenHash,
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    // creating Access token
    let AccessToken = generateAccessToken(existUser._id, session._id);

    return res.status(200).json({
      firstName: existUser.firstName,
      lastName: existUser.lastName,
      userName: existUser.userName,
      email: existUser.email,
      profileImage: existUser.profileImage,
      AccessToken,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// user logout
export const logOut = async (req, res) => {
  // find active sessions and compare the cookie token with each stored hash using bcrypt.compare(): ************************
  try {
    const RefreshToken = req.cookies.refreshToken;

    if (!RefreshToken) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }

    const refreshTokenHash = crypto
      .createHash("sha256")
      .update(RefreshToken)
      .digest("hex");

    const session = await Session.findOne({
      refreshTokenHash,
      revoked: false,
    });

    // if refreshToken is inavlid clear it other wise user can send it multiple times
    if (!session) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENVIRONMENT === "production",
        sameSite: "strict",
      });
      return res.status(401).json({ message: "Refresh token is not valid" });
    }

    // De-activate the refreshToken
    session.revoked = true;
    await session.save();

    //  ***************************************************************************************************
    // After clearing the refreshToken user still have access to use Access token for defiend TimeRanges, this is called Token BlackListing
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT === "production",
      sameSite: "strict",
    });

    return res.status(200).json({ message: "User successfully logged out" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

//logout from every devices
export const logOutAll = async (req, res) => {
  try {
    const userID = req.userId;
    if (!userID) {
      return res.status(400).json({
        message: "user not found",
      });
    }
    // find all refresh-token from all session and de-activate them
    await Session.updateMany(
      {
        user: userID,
        revoked: false,
      },
      {
        revoked: true,
      },
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENVIRONMENT === "production",
      sameSite: "strict",
    });

    return res
      .status(200)
      .json({ message: "User successfully logged out from all devices" });
  } catch (error) {
    return res.status(500).json(error);
  }
};


// verify email 
export async function verifyEmail(req, res) {
  try {
    const { otp, email } = req.body;
    if (!otp || !email) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const otpHashed = crypto
      .createHash("sha256")
      .update(String(otp))
      .digest("hex");

    const otpDoc = await OTP.findOne({ email, otpHashed });
    if (!otpDoc) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const user = await User.findByIdAndUpdate(
      otpDoc.user,
      { verified: true },
      { new: true },
    );

    await OTP.deleteMany({ user: otpDoc.user });

    return res.status(200).json({
      message: "Email verified successfully",
      user: {
        userName: user.userName,
        email: user.email,
        verified: user.verified,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


// // automatic token based login
export const getUserData= async(req,res)=>{
try {
  let userId = req.userId;
  if (!userId) {
    return res.status(400).json({ message: "user Id is not found" });
  }
  // fetching the user by the id
  let user = await User.findById(userId);
  if (!user) {
    return res.status(400).json({ message: "user is not found" });
  }

  return res.status(200).json({
    firstName: user.firstName,
    lastName: user.lastName,
    userName: user.userName,
    email: user.email,
    profileImage: user.profileImage,
  });
} catch (error) {
  return res.status(500).json(error);
}
 }