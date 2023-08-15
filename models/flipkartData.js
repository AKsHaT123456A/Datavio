const mongoose = require('mongoose');

const flipSchema = mongoose.Schema(
    {
        userId: {
            type: String,
            required: [true, "User ID is required"],
            trim: true,
        },
        url: {
            type: String,
            required: [true, "URL is required"],
            trim: true,
        },
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
        },
        description: {
            type: String,
            default: "NA",
            trim: true,
        },
        numReviews: {
            type: Number,
            required: [true, "Number of reviews is required"],
        },
        ratings: {
            type: String,
            required: [true, "Ratings are required"],
            trim: true,
        },
        mediaCount: {
            type: Number,
            required: [true, "Media count is required"],
        },
    },
    {
        versionKey: false, 
        timestamps: true, 
    }
);

// Creating the Flipkart model
const Flipkart = mongoose.model('Flipkart', flipSchema);

module.exports = Flipkart;
