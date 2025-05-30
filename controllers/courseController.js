const db = require('../models/indexStart');  // Import the db object
const createError = require('http-errors');

const Course = db.courses;
const Student = db.students;  // Define the Student model

module.exports = {
    // Add a Course
    addCourse: async (req, res, next) => {
        try {
            let info = {
                coursename: req.body.coursename,
            };
            let addCourse = await Course.create(info);
            res.status(200).send(addCourse);
        } catch (error) {
            next(error);
        }
    },

    // Get all Courses with associated Students
    getCourses: async (req, res, next) => {
        try {
            let allCourses = await Course.findAll({
                include: [{
                    model: Student,
                    as: 'students',  // Use the correct alias: 'students'
                    attributes: ['firstname', 'lastname']  // Include associated student data
                }]
            });
            res.status(200).send(allCourses);
        } catch (error) {
            next(error);
        }
    },

    // Get a single Course by ID
    getCourse: async (req, res, next) => {
        try {
            let id = req.params.id;
            let course = await Course.findOne({
                where: { course_id: id },
                include: [{
                    model: Student,
                    as: 'students',  // Use the correct alias: 'students'
                    attributes: ['firstname', 'lastname']  // Include associated student data
                }]
            });
            if (!course) {
                throw createError(404, "Course not found");
            }
            res.status(200).send(course);
        } catch (error) {
            next(error);
        }
    },

    // Update a Course by ID
    updateCourse: async (req, res, next) => {
        try {
            let id = req.params.id;
            let course = await Course.findOne({ where: { course_id: id } });

            if (!course) {
                throw createError(404, "Course not found");
            }

            // Update course with new data
            await course.update(req.body);

            res.status(200).send({ message: "Course updated successfully" });
        } catch (error) {
            next(error);
        }
    },

    // Delete a Course by ID
    deleteCourse: async (req, res, next) => {
        try {
            let id = req.params.id;
            let course = await Course.findOne({ where: { course_id: id } });

            if (!course) {
                throw createError(404, "Course not found");
            }

            await course.destroy();
            res.status(200).send({ message: "Course deleted successfully" });
        } catch (error) {
            next(error);
        }
    }
};
