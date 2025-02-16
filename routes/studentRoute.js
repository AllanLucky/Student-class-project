const express = require('express');
const studentController = require('../controllers/studentController');
const {verifyAccessToken} = require('../helpers/jwtHelper')
const routes = express.Router();

routes.post('/addStudent', studentController.addStudent);
routes.get('/getAllStudents', studentController.getStudents);
routes.get('/getStudent/:id', verifyAccessToken, studentController.getStudent);  // Include :id in the route
routes.put('/updateStudent/:id', verifyAccessToken, studentController.updateStudent);
routes.delete('/deleteStudent/:id', verifyAccessToken, studentController.deleteStudent);

module.exports = routes;