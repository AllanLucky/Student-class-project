const dbConfig = require('../config/dbConfig'); // Your Database config file
const { Sequelize, DataTypes } = require('sequelize');

// Set up the Sequelize connection
const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false

    }
);

// Authenticate the connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connection successful...');
    })
    .catch(err => {
        console.log('Error: ' + err);
    });

const db = {};

// Store Sequelize and connection instance
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import models
db.students = require('./studentModel')(sequelize, DataTypes);
db.courses = require('./courseModel')(sequelize, DataTypes);
db.users = require('./authModel.js')(sequelize, DataTypes);

// Associations
db.students.belongsTo(db.courses, { foreignKey: 'course_id', as: 'course' });
  // A Student belongs to one Course

// Sync the models with the database
db.sequelize.sync({ force: false })
    .then(() => {
        console.log('Database re-sync done');
    })
    .catch(err => {
        console.log('Sync Error: ' + err);
    });

module.exports = db;
