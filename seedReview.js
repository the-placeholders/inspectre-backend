const mongoose = require('mongoose');
require('dotenv').config();
const Review = require ('./Models/Review.js');

async function seed() {
    mongoose.connect (
        process.env.DB_URL
    );
    await Review.create({
        location_image: 'img',
        daily_likes: 0,
        weekly_likes: [0, 0, 0, 0, 0, 0, 0],
        total_likes: 0, 
        user_id: '6194443d37e4902115436d3a',
        location_id: '619306d8731c488031fe809a', 
        review_text: 'this was fun'
        })
    mongoose.disconnect()
}

seed();
