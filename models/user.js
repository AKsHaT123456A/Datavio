const mongoose = require('mongoose');

const UserSchema = mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required"],
            unique: true, //  !unique email addresses
            trim: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            trim: true,
        },
        url: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Flipkart", // !Referencing the Flipkart model
                default: [], // Default to an empty array
            },
        ],
    },
    {
        versionKey: false, 
        timestamps: true, 
    }
);

// !Creating the User model
const User = mongoose.model('User', UserSchema);

module.exports = User;
