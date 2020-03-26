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

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
