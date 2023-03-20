const mongoose = require('mongoose');

const clientShema = new mongoose.Schema({
    userName: {
        type: String,
        // required: [true, 'clientname is required'],
        // unique: true
    },
    password: {
        type: String,
        // required: [true, 'Password is required']
    },
    image: {
        type: String
    },
    clientName: {
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
    isActive : {
        type: Boolean,
        default: false
    },
    clientTarget: {
        type: String
    },
    notes: {
        type: String
    },
    foodRegime: {
        type: String
    },
    createrId: {
        type: mongoose.Types.ObjectId,
        ref: 'Trainer'
    }
    
});

const Client = mongoose.model('Client', clientShema);

module.exports = Client;
