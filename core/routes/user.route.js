'use strict'
const express = require('express');
var userController = require('../controllers/user.controller');
const router = express.Router();
const verify = require('../helper/verifyToken');
var multipart = require('multiparty');
var multipartMiddleware = multipart({ uploadDir: './uploads' });

router.get('/', userController.home);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/users', verify, userController.getAllUsers);
router.get('/users/:id', verify, userController.getUserById);
router.delete('/users/:id', verify, userController.deleteUser);
router.put('/users/:id', verify, userController.updateUser);
router.post('/image/:id', verify, multipartMiddleware, projectController.uploadImage);
router.get('/image/:image', projectController.getImageFile);

module.exports = router;