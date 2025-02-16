const db = require('../models/indexStart');
const createError = require('http-errors');

const Student = db.students;
const Course = db.courses;

module.exports = {
    // AddStudent
    addStudent: async (req, res, next) => {
        try {
            let info = {
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                gender: req.body.gender,
                course_id: req.body.course_id // Ensure the course ID is passed
            };
            const addStudent = await Student.create(info);
            res.status(201).send(addStudent);
        } catch (error) {
            next(error);
        }
    },

    // Get all Students with associated Course
    getStudents: async (req, res, next) => {
        try {
            const allStudents = await Student.findAll({
                include: [{
                    model: Course,
                    as: 'course',  // Use the alias 'course' here
                    attributes: ['coursename']  // Only include the course name
                }]
            });
            res.status(200).send(allStudents);
        } catch (error) {
            next(error);
        }
    },

    // Get student by id with associated Course
    getStudent: async (req, res, next) => {
        try {
            let id = req.params.id;
            let student = await Student.findOne({
                where: { student_id: id },
                include: [{
                    model: Course,
                    as: 'course',  // Include the associated course
                    attributes: ['coursename']
                }]
            });

            if (!student) {
                throw (createError(404, "Student does not exist"));
            }
            res.status(200).send(student);
        } catch (error) {
            next(error);
        }
    },

    // Update student
    updateStudent: async (req, res, next) => {
        try {
            let id = req.params.id;
            let student = await Student.findOne({ where: { student_id: id } });

            if (!student) {
                throw (createError(404, "Student does not exist"));
            }
            await student.update(req.body);
            res.status(200).send(student);
        } catch (error) {
            next(error);
        }
    },

    // Delete a student
    deleteStudent: async (req, res, next) => {
        try {
            let id = req.params.id;
            await Student.destroy({ where: { student_id: id } });
            res.status(200).send("Student deleted successfully");
        } catch (error) {
            next(error);
        }
    }
};
