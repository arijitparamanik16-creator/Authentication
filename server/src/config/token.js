import jwt from "jsonwebtoken";

export const generateAccessToken = (id, sessionId) =>    
    // storing the sessionId also 
    jwt.sign({ sessionId }, process.env.JWT_SECRET, {
        subject: id.toString(),
        expiresIn: "15m",
    });
    // subject: id stores the user ID in the standard JWT sub claim. so, decoded.sessionId=sessionId and decoded.sub=userId

export const generateRefreshToken = (id) => {
  let token = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  // Token = Payload + Signature(created using the secret)
  return token;
};
