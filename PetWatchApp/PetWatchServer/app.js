require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const swaggerSetup = require('./swagger');
const mongoUser = process.env.MONGO_USERNAME;
const mongoPass = process.env.MONGO_PASSWORD;
const appRoutes = require('./src/routes/appRoutes');

const mongoUri = `mongodb+srv://${mongoUser}:${mongoPass}@petwatch.bfebbx2.mongodb.net/`;

const app = express();
const PORT = process.env.PORT;

app.use(cors());

mongoose.connect(mongoUri, {
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// set the default connection
const db = mongoose.connection;

// bind connection to error event - to get notifications of connection errors
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

db.once('open', function () {
    console.log('Connected to the database');  
});


//bodyParser setup
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

swaggerSetup(app);
app.use(express.json());

// API routes
app.use('/api', appRoutes);

app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
