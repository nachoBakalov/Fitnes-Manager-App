const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const helmet = require('helmet')


const routes = require('./routes');
const { initializeSettings } = require('./middlewares/settingsMiddleware');
const { authentication, authorization } = require('./middlewares/authMiddleware');
const { postJSONTrimmer } = require('./middlewares/postJSONTrimmer');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(postJSONTrimmer());
app.use(initializeSettings());
app.use(authentication());
app.use(authorization());
app.use(routes);


mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/fitnesManagerTestApp');

app.listen(3030, () => console.log('App run on 3030'));