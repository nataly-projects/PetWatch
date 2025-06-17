require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const swaggerSetup = require('./swagger');
const mongoUri = process.env.MONGO_URI;
const appRoutes = require('./src/routes/appRoutes');

const app = express();
const PORT = process.env.PORT;

mongoose.connect(mongoUri)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function () {
    console.log('Connected to the database');  
});

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

swaggerSetup(app);
app.use(express.json());

app.use('/api', appRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});

module.exports = app;
