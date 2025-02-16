const bcrypt = require('bcryptjs');
const crypto = require('crypto');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        user_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    // Function to hash password before saving............................
    User.beforeCreate(async (user) => {
        try {
            const salt = await bcrypt.genSalt(12);
            const hashedPwd = await bcrypt.hash(user.password, salt);
            user.password = hashedPwd;
        } catch (error) {
            throw new Error('Error encrypting password');
        }
    });


   // Function to create a reset password token...........................

   User.prototype.createResetPasswordToken = async function() {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    console.log(resetToken, this.passwordResetToken);
    return resetToken;
};


    // Function to compare the entered password with the save save hashed password..................

    User.prototype.isValidPassword = async function(password){
        try{
            return await bcrypt.compare(password, this.password);
     
        } catch (error){
            throw error;
        }
    };

    return User;
};
