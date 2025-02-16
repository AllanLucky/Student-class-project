const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./models/indexStart');

const app = express();

var corOptions = {
    origin: 'http://localhost:3000'
};

app.use(cors(corOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const studentRoute = require('./routes/studentRoute');
const courseRoute = require('./routes/courseRoute');
const authRoute = require('./routes/authRoute');

// Corrected routes with starting '/'
app.use('/Students', studentRoute);
app.use('/Courses', courseRoute);
app.use('/Auth', authRoute);



const PORT = process.env.PORT || 6000;

// handing 404 error
// app.use(async(req, res, next)=>{
    //next(createError.NotFound())
   // })

// Global error-handling middleware  
app.use((err, req, res, next)=>{
    res.status(err.status || 500)
    res.send({
        error:{
            status: err.status || 500,
            message: err.message
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
