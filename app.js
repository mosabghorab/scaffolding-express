// ||... requires ...||
require('dotenv').config();
require('express-async-errors');
require('./src/server');
require('./src/services/firebase/firebase');
var cors = require('cors')
const fileUpload = require('express-fileupload');
const express = require('express');

// routers.
const appRouter = require('./src/modules/_app/app-router');
const authRouter = require('./src/modules/auth/auth-router');
const profileRouter = require('./src/modules/profile/profile-router');
const usersRouter = require('./src/modules/users/users-router');
const coursesRouter = require('./src/modules/courses/courses-router');
const levelsRouter = require('./src/modules/levels/levels-router');
const lessonsRouter = require('./src/modules/lessons/lessons-router');
const questionsRouter = require('./src/modules/questions/questions-router');
// const answersRouter = require('./src/modules/answers/answers-router');
const usersCoursesRouter = require('./src/modules/users-courses/users-courses-router');
const quizesRouter = require('./src/modules/quezes/quizes-router');
const certificatesRouter = require('./src/modules/certificates/certificates-router');
const certificateTemplatesRouter = require('./src/modules/certificate-templates/certificate-templates-router');
const teammatesRouter = require('./src/modules/teammates/teammates-router');
const donatorsRouter = require('./src/modules/donators/donators-router');
const settingsRouter = require('./src/modules/settings/settings-router');

// ||... not found handler ...||
const notFoundMiddleware = require('./src/middlewares/not-found-middleware');
// auth middleware.
const { userMiddleware, adminMiddleware } = require('./src/middlewares/auth-middleware');
// ||... error handler ...||
const errorHandlerMiddleware = require('./src/middlewares/error-handler-middleware');


// ||... init express app ...||
const port = process.env.PORT || 3000;
const app = express();

// ||... app uses ...||
app.use(cors({
    origin: ['http://localhost:3000','https://scaffolding.vercel.app'],
    credentials: true
}));
app.use(fileUpload());
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ||... routers ...||
app.use('/api/app', adminMiddleware, appRouter);
app.use('/api/auth', authRouter);
app.use('/api/profile', userMiddleware, profileRouter);
app.use('/api/users', adminMiddleware, usersRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/levels', levelsRouter);
app.use('/api/lessons', lessonsRouter);
app.use('/api/questions', questionsRouter);
// app.use('/api/answers', answersRouter);
app.use('/api/users-courses', userMiddleware, usersCoursesRouter);
app.use('/api/quizes', userMiddleware, quizesRouter);
app.use('/api/certificates', certificatesRouter);
app.use('/api/certificate-templates',certificateTemplatesRouter);
app.use('/api/teammates',teammatesRouter);
app.use('/api/donators',donatorsRouter);
app.use('/api/settings',settingsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const start = async () => {
    try {
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`)
        );
    } catch (error) {
        console.log(error);
    }
};

// connect to the db and starting the server.
start();