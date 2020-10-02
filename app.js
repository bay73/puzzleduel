const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const expressip = require('express-ip');
const cookieParser = require('cookie-parser');

const app = express();

require('dotenv').config();
require('./config/passport')(passport);

mongoose
  .connect(
    require('./config/keys').mongoURI,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressip().getIpInfoMiddleware);
app.use(cookieParser());
app.use(require('./config/i18n'));
app.use(session(require('./config/auth').sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('./config/flash'));
app.use(require('./config/theme'));


// Routes
app.use('/', require('./routes/index.js'));
app.use('/users', require('./routes/users.js'));
app.use('/puzzles', require('./routes/puzzles.js'));
app.use('/single', require('./routes/single.js'));
app.use('/archive', require('./routes/archive.js'));
app.use('/contest', require('./routes/contest.js'));
app.use('/rating', require('./routes/rating.js'));
app.use('/admin', require('./routes/admin.js'));
app.use('/userstat', require('./routes/userstat.js'));

// Static content
app.use('/images', express.static(__dirname + '/images', { maxage: '3d' }));
app.use('/js', express.static(__dirname + '/js', { maxage: '3h' }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT} at ` + new Date().toString()));
