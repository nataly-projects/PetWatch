const express = require('express');

const userRoutes = require('./userRoutes');
const petRoutes = require('./petRoutes');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});

router.use('/users/', userRoutes);
router.use('/pets/', petRoutes);

module.exports = router;