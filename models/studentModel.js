module.exports = (sequelize, DataTypes) => {
    const Student = sequelize.define('Student', {
        student_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        gender: DataTypes.STRING,
    });

    return Student;
};
