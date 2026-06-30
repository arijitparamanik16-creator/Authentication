import JWT from "jsonwebtoken";

export const checkAuth = (req, res, next) => {
  try {
    // fetching the token stored in response cookies
    let token = req.cookies.token;
    // Read all cookies received in the request (browser automatically attaches the stored cookie to the request:)
    if (!token) {
      return res
        .status(401)
        .json({ message: "this user is not authenticated" });
    }

    // the token is created user_id + JWT_SECRET, now JWT.verify decode the token and returns an obj which contains the user_id
    let decode = JWT.verify(token, process.env.JWT_SECRET);

    req.userId = decode.id;
    // is a custom made property stores user_id in req
    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal server error!" });
  }
};
