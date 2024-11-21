const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const session = require('express-session');
const expressip = require('express-ip');
const cookieParser = require('cookie-parser');
const profiler = require('./utils/profiler');
const cache = require('./utils/cache');

const app = express();

require('dotenv').config();
require('./config/passport')(passport);

app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({limit: '1mb', parameterLimit: 10000, extended: true}));
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
app.use('/duel', require('./routes/duel.js'));
app.use('/puzzleset', require('./routes/puzzleset.js'));
app.use('/rating', require('./routes/rating.js'));
app.use('/admin', require('./routes/admin.js'));
app.use('/userstat', require('./routes/userstat.js'));
app.use('/league', require('./routes/leagues.js'));
app.use('/announcements', require('./routes/announcements.js'));
app.use('/mailbox', require('./routes/mailbox.js'));
app.use('/sudoqlog', require('./routes/sudoqlog.js'));

// Static content
app.use('/images', express.static(__dirname + '/images', { maxage: '3d' }));
app.use('/js', express.static(__dirname + '/js', { maxage: '3h' }));
app.use('/css', express.static(__dirname + '/css', { maxage: '3h' }));
app.use('/.well-known',express.static(__dirname + '/.well-known'));

app.use((err, req, res, next) => {
  res.locals.theme = 'default';
  console.error(err.stack)
  res.status(500).render('error');
})

const PORT = process.env.PORT || 5000;

setInterval(()=>{
  const used = process.memoryUsage().heapUsed / 1024 / 1024;
  console.log('Memory used:    ' + (Math.round(used * 100) / 100) + ' MB');
  cache.printCacheSize();
  profiler.dump(console.log);
},60000)

setInterval(cache.clearOutdatedCache, 10*60*000)

setInterval(cache.resetCache, 24*60*60*1000)

app.listen(PORT, console.log(`Server started on port ${PORT} at ` + new Date().toString()));
