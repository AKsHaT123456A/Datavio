const User = require("../models/user");
const bcrypt = require("bcryptjs");
const constants = require("../utils/constants");
const jwt = require("jsonwebtoken");
const { handleErrorResponse } = require("../utils/handleError");
const logger = require("../utils/logger");


module.exports.register = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
        email,
        password: hashedPassword,
    });

    try {
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists", success: false })
        await newUser.save();
        res.json({ message: "User registered successfully." });
    } catch (error) {
        logger.error("Error registering user:", error);
        res.status(500).json({ error: "An error occurred while registering user." });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return handleErrorResponse(res, 400, "Please provide an email and password");
        }

        const user = await User.findOne({ email }, { _id: 1, password: 1 }).lean();

        if (!user) {
            return handleErrorResponse(res, 400, "User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return handleErrorResponse(res, 400, "Invalid password");
        }

        const [accessToken, refreshToken] = await Promise.all([
            jwt.sign({ _id: user._id }, constants.ACCESS_TOKEN_SECRET, { expiresIn: constants.TOKEN_EXPIRATION }),
            jwt.sign({ _id: user._id }, constants.REFRESH_TOKEN_SECRET),
        ]);

        res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "none" });
        return res.status(200).json({ message: "Logged in successfully", accessToken });
    } catch (error) {
        return handleErrorResponse(res, 500, "An error occurred while logging in", error);
    }
};

module.exports.refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            logger.warn("Refresh failed: Refresh token missing");
            return handleErrorResponse(res, 401, "Refresh token required");
        }

        const decoded = jwt.verify(refreshToken, constants.REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign({ _id: decoded._id }, constants.ACCESS_TOKEN_SECRET, { expiresIn: constants.TOKEN_EXPIRATION });

        logger.info("Access token refreshed");
        return res.json({ accessToken: newAccessToken });
    } catch (error) {
        logger.error("An error occurred:", error);
        return handleErrorResponse(res, 500, "An error occurred while refreshing token", error);
    }
};

module.exports.logout = (req, res) => {
    res.clearCookie("refreshToken", { httpOnly: true, secure: true, sameSite: "none" });
    return res.status(200).json({ message: "Logged out successfully" });
};





