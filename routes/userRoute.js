const express = require('express');
const createUser = require('../controllers/register');
const login = require('../controllers/login');

const router=express.Router();

router.post("/register", createUser);
router.post("/login", login);

module.exports = router;