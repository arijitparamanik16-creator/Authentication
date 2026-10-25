import JWT from "jsonwebtoken";

// Access token: protects APIs that need an authenticated user
export const checkAuthAccess = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return res.status(401).json({
        message: "Access token not found",
      });
    }

    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    // Access token stores user ID in the standard "sub" claim
    req.userId = decoded.sub;
    req.sessionId = decoded.sessionId;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired access token",
    });
  }
};

// Refresh token: protects the refresh endpoint
export const checkAuthRefresh = (req, res, next) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "Refresh token not found",
      });
    }
    // the token is created user_id + JWT_SECRET, now JWT.verify decode the token and returns an obj which contains the user_id
    const decoded = JWT.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired refresh token",
    });
  }
};
