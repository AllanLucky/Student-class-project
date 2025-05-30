const express = require('express');
const courseController = require('../controllers/courseController');
const { verifyAccessToken } = require('../helpers/jwtHelper');


const routes = express.Router()
routes.post('/addCourse', courseController.addCourse);
routes.get('/getAllCourses',courseController.getCourses);
routes.get('/getCourse/:id', verifyAccessToken,courseController.getCourse);  // Added this route
routes.put('/updateCourse/:id',verifyAccessToken, courseController.updateCourse);  // Added :id to URL
routes.delete('/deleteCourse/:id', courseController.deleteCourse);  // Added this route

module.exports = routes