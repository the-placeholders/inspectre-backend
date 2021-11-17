'use strict';

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    location_image: String,
    daily_likes: Number,
    weekly_likes: Array, //array of daily likes, newest gets pushed to start of array, oldest gets popped off the end
    total_likes: Number,
    user_id: String, //takes _id of user leaving the review
    location_id: String, //takes _id of location being reviewed
    review_text: String
});

const Review = new mongoose.model('Review',reviewSchema);

module.exports = Review;