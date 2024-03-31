const express = require('express');

const userRoutes = require('./userRoutes');
const petRoutes = require('./petRoutes');

const router = express.Router();

router.use('/users/', userRoutes);
router.use('/pets/', petRoutes);


module.exports = router;