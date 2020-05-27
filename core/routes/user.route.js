'use strict'
const express = require('express');
var userController = require('../controllers/user.controller');
const router = express.Router();
const verify = require('../helper/verifyToken');

router.get('/', userController.home);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users', verify, userController.getAllUsers);
router.get('/users/:id', verify, userController.getUserById);
router.delete('/users/:id', verify, userController.deleteUser);
router.put('/users/:id', verify, userController.updateUser);

module.exports = router;