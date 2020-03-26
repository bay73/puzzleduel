const express = require('express');
const expressLayouts = require('express-ejs-layouts');

const app = express();

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', require('./routes/index.js'));

// Static content
app.use('/images', express.static(__dirname + '/images'));
app.use('/js', express.static(__dirname + '/js'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
