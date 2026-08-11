import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import ApiResponse from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, fullName, password } = req.body;
    console.log("User created:", email, username, fullName, password);

    if (!username.trim() || !email.trim() || !fullName.trim() || !password.trim()) {
        throw new ApiError(400, "All fields are required");
    }
    const emailRegex = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{1,255}$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, "Invalid email format");
    }
    const fullNameRegex = /^[a-zA-Z\s]+$/;
    if (!fullNameRegex.test(fullName)) {
        throw new ApiError(400, "Full name can only contain letters and spaces");
    }

    const usernameRegex = /^\w+$/;
    if (!usernameRegex.test(username)) {
        throw new ApiError(400, "Username can only contain letters, numbers, and underscores");
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new ApiError(409, "Email or username already exists");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar and cover image are required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar || !coverImage) {
        throw new ApiError(500, "Failed to upload images to Cloudinary");
    }

    const user = await User.create({
        fullName, avatar: avatar.url, coverImage: coverImage?.url, username: username.toLowerCase(), email, password
    });
    const createUser = await User.findById(user._id)
        .select("-password -refreshToken"
        );

    if (!createUser) {
        throw new ApiError(500, "Failed to create user");
    }

    return res.status(201).json(new ApiResponse(201, createUser, "User registered successfully"));
});

export { registerUser };