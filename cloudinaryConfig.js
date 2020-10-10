const cloudinary = require('cloudinary').v2;

module.exports = cloudinary.config({
    cloud_name: 'aldair',
    api_key: process.env.CLOUDINARY_SECRET,
    api_secret: process.env.CLOUDINARY_URL,
});