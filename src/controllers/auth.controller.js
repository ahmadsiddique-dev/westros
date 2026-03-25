import { User } from "../models/user.model.js";
import { ErrorApi } from "../utils/errorAPI.js";
import { ApiResponse } from "../utils/responseAPI.js";
import jwt from "jsonwebtoken";

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ErrorApi(401, "Missing credientials");
    }

    const user = await User.findOne(
        { email },
        { email: 1, password: 1, username: 1 }
    );

    const isPasswordCorrect = await user.isPasswordCorrect(password);

    if (!isPasswordCorrect) {
        throw new ErrorApi(401, "Wrong Password or Email");
    }

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const userData = {
        username: user.username,
        email: user.email,
        accessToken: accessToken,
    };

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "prod",
    };

    res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: userData,
                },
                "User signed up successfully"
            )
        );
};

const handleSignup = async (req, res) => {
    const { username, email, password } = await req.body;

    if (!username || !email || !password) {
        throw new ErrorApi(401, "Missing credientials");
    }

    const user = await User.findOne({ email });

    if (user) {
        throw new ErrorApi(403, "User already exists. Please Login!");
    }

    const newUser = await User.create({
        username,
        email,
        password,
    });

    if (!newUser) {
        throw new ErrorApi(500, "Error in generating newuser");
    }

    const accessToken = await newUser.generateAccessToken();
    const refreshToken = await newUser.generateRefreshToken();

    newUser.refreshToken = refreshToken;
    await newUser.save({ validateBeforeSave: false });

    const userData = {
        username: newUser.username,
        email: newUser.email,
        accessToken: accessToken,
    };

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "prod",
    };

    res.status(200)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: userData,
                },
                "User signed up successfully"
            )
        );
};

const handleLogout = async (req, res) => {
    const { _id } = await req.body;

    if (!_id) {
        throw new ErrorApi(404, "Missing User id");
    }

    await User.findByIdAndUpdate(_id, { refreshToken: null });

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "prod",
    };

    res.status(200)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged out successfully"));
};

const handleRefresh = async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new ErrorApi(401, "Refresh Token not found");
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET
        );

        const user = await User.findById(decoded._id);

        if (!user) {
            throw new ErrorApi(404, "User not found");
        }

        if (user.refreshToken !== refreshToken) {
            throw new ErrorApi(403, "Invalid refresh token");
        }

        const newAccessToken = user.generateAccessToken();
        const newRefreshToken = user.generateRefreshToken();

        user.refreshToken = newRefreshToken;
        await user.save({ validateBeforeSave: false });

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV === "prod",
            sameSite: "Strict",
        };

        res.status(200)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200,
                    {
                        accessToken: newAccessToken,
                    },
                    "Access token refreshed successfully"
                )
            );
    } catch (error) {
        throw new ErrorApi(403, "Invalid or expired refresh token");
    }
};

export { handleLogin, handleSignup, handleRefresh, handleLogout };
