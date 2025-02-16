module.exports = (sequelize, DataTypes) => {
  const Course = sequelize.define('course', {
      course_id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
      },
      coursename: {
          type: DataTypes.STRING,
          allowNull: false,
      },
  });

  // Association: Course has one Student
  Course.associate = (models) => {
      Course.hasOne(models.Student, {
          foreignKey: 'course_id',  // Foreign key in Student model
          as: 'student',
      });
  };

  return Course;
};

  