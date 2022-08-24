const { Router } = require('express');
const router = Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { restart } = require('nodemon');

router.get('/', (req, res) => {
    res.send('API HERE')
});

