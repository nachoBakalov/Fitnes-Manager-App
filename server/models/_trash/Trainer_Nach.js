const mongoose = require('mongoose');

const trainerShema = new mongoose.Schema({
    userName: {
        type: String
        // required: [true, 'clientname is required'],
        // unique: true
    },
    password: {
        type: String
        // required: [true, 'Password is required']
    },
    image: {
        type: String
    },
    name: {
        type: String
    },
    phoneNumber: {
        type: Number
    },
    email: {
        type: String,
    },
    createDate: {
        type: String,
        // require: true
    },
    target: {
        type: String
    },
    notes: {
        type: String
    },
    createrId: {
        type: mongoose.Types.ObjectId,
        ref: 'Manager'
    }
    
});

const Trainer = mongoose.model('Trainer', trainerShema);

module.exports = Trainer;
