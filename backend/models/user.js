import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            default: "not provided"
        },
        isBlocked: {
            type: Boolean,
            default: false
        },
        role: {
            type: String,
            default: "user"
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        image: {
            type: String,
            default: "not provided"
        },
        address: {
            type: String,
            default: "not provided"
        }
    },
    { timestamps: true }
);

const User = mongoose.model("Users", userSchema);

export default User;