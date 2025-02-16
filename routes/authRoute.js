const express = require('express');
const {verifyAccessToken} = require('../helpers/jwtHelper')
const authController = require('../controllers/authController')

const routes = express.Router();

routes.post('/addUser',verifyAccessToken,authController.addUser)
routes.get('/getAllUsers',verifyAccessToken,authController.getUsers)
routes.post('/loginUser' , verifyAccessToken, authController.loginUser)
routes.get('/getUser/:id',verifyAccessToken, authController.getUser)
routes.put('/updateUser/:id',verifyAccessToken, authController.updateUser)
routes.delete('/deleteUser/:id',verifyAccessToken, authController.deleteUser)

module.exports = routes
