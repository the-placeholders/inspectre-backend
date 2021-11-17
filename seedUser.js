const { test } = require('media-typer');
const mongoose = require('mongoose');
const { disconnect } = require('process');
require('dotenv').config();

const User = require ('./Models/User.js');

async function seed() {
    mongoose.connect (
        process.env.DB_URL
    );
    await User.create(
        {join_date: 1/1/2021, email: 'userEmail@test.com', user_name: 'user', profile_img: 'img', library: []}
    )
    mongoose.disconnect()
}

seed();
