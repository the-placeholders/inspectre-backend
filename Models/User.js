'use strict';

const userSchema = new mongoose.Schema({
    join_date: Date,
    email: String, //from auth0
    user_name: String,
    profile_img: String,
    library: Array
});

const User = new mongoose.model('User', userSchema);

module.exports = User;