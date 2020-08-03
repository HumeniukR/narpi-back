const createError = require('http-errors');
const express = require('express');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const authMiddleware = require('./middleware/auth')
const logsRouter = require('./routes/logs');
const controllerRouter = require('./routes/controller');
const authRouter = require('./routes/auth');
const playerRouter = require('./routes/player');
const vacuumRouter = require('./routes/vacuum');
const usersRouter = require('./routes/user');

const app = express();

// TODO add config for CORS
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/auth', authRouter);
app.use('/logs', authMiddleware, logsRouter);
app.use('/controller', authMiddleware, controllerRouter);
app.use('/player', authMiddleware, playerRouter);
app.use('/vacuum', authMiddleware, vacuumRouter);
app.use('/users', authMiddleware, usersRouter);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('Error');
});

module.exports = app;
