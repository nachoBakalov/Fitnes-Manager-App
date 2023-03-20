const mongoose = require('mongoose');

const managerShema = new mongoose.Schema({
    email: {
        type: String,
    },
    password: {
        type: String,
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
    createDate: {
        type: String,
        // require: true
    },
    target: {
        type: String
    },
    notes: {
        type: String
    }
});

const Manager = mongoose.model('Manager', managerShema);

module.exports = Manager;
