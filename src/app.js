require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const restosRouter = require('./restos/restos-router');
const commentsRouter = require('./comments/comments-router');
const authRouter = require('./auth/auth-router')




const app = express();

const morganOption = (process.env.NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

app.use('/api/restaurants', restosRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/auth', authRouter)


app.get('/', (req, res) => {
       res.send('Hello, world!')
});

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
      response = { error: 'Server error' }
    } else {
      console.error(error)
      response = { message: error.message, error }
    }
    res.status(500).json(response)
});

module.exports = app;