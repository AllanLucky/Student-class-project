const db = require('../models/indexStart');  // Ensure path to your models is correct
const createError = require('http-errors');
const { signAccessToken } = require('../helpers/jwtHelper')
const {authSchema} = require('../helpers/validateSchema')

// Use the capitalized model 'User'
const User = db.users;

module.exports = {

    // Add a User
    addUser: async (req, res, next) => {
        try {
            const { email, password} = await authSchema.validateAsync(req.body);
            const exists = await User.findOne({ where: { email } });  // Use 'User
            if (exists) {
                throw createError.Conflict(`${email} has already been registered`);
            }
            const newUser = new User({ email, password });
            const saveUser = await newUser.save();

            const accessToken = await signAccessToken(saveUser.user_id)
            res.status(200).send({ accessToken });
        } catch (error) {
            next(error);
        }
    },

    // Get all Users
    getUsers: async (req, res, next) => {
        try {
            let allUsers = await User.findAll({});
            res.status(200).send(allUsers);
        } catch (error) {
            next(error);
        }
    },
    
     // Login User
   loginUser: async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body);
        const user = await User.findOne({ where: { email: result.email } });

        if (!user) throw createError.NotFound('User not registered');

        // Matching the password
        const ismatch = await user.isValidPassword(result.password);
        if (!ismatch) throw createError.Unauthorized('Username/password not valid');

        // If password matches, then generate token
        const accessToken = await signAccessToken(user.user_id);
        const refreshToken = await signAccessToken(user.user_id);  // Consider creating a separate function for refreshToken

        res.send({ accessToken, refreshToken });
        } catch (error) {
            if(error.isJoi ===true)
                return next(createError.BadRequest('Invalid username/password'))
        next(error);
       }
   },             

    // Get a single User
    getUser: async (req, res, next) => {
        try {
            let id = req.params.id;
            let user = await User.findOne({ where: { user_id: id } });  // Match the key field name with 'user_id'
            
            if (!user) {
                throw createError(404, "User not found");
            }

            res.status(200).send(user);
        } catch (error) {
            next(error);
        }
    },

    // Update a User by ID
    updateUser: async (req, res, next) => {
        try {
            let id = req.params.id;
            let user = await User.findOne({ where: { user_id: id } });  // Use 'User' and the correct key field

            if (!user) {
                throw createError(404, "User not found");
            }

            // Update user with new data
            await user.update(req.body);

            res.status(200).send({ message: "User updated successfully" });
        } catch (error) {
            next(error);
        }
    },

    // Delete a User by ID
    deleteUser: async (req, res, next) => {
        try {
            let id = req.params.id;
            let user = await User.findOne({ where: { user_id: id } });  // Use 'User' and the correct key field

            if (!user) {
                throw createError(404, "User not found");
            }

            await user.destroy();
            res.status(200).send({ message: "User deleted successfully" });
        } catch (error) {
            next(error);
        }
    },
};
