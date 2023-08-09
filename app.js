require('dotenv').config();

const express = require('express');
const expressLayout = require('express-ejs-layouts');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require('cors')
app.use(cors());


mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology: true } )

.then(() => console.log('Connected Successfully'))

.catch((err) => { console.error(err); });

app.use(express.static('public'));

// Templating Engine
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use('/', require('./server/routes/main'));


app.listen(PORT, ()=> {
  console.log(`App listening on port ${PORT}`);
});