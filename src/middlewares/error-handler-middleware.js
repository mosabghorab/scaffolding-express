const {StatusCodes} = require('http-status-codes');
const Response = require('../config/utils/response');


const errorHandlerMiddleware = (err, req, res, next) => {
    // default error.
    const response = new Response(false, err.message === '' ? 'Something went wrong , try again later' : err.message);
    // check error by name.
    // switch (err.name) {
    //     case 'CastError':
    //         response.messageEn = `No item found with id ${err.value}`;
    //         response.code = StatusCodes.NOT_FOUND;
    //         break;
    //     case 'ValidationError':
    //         response.messageEn = Object.values(err.errors).map((item) => item.message).join(',');
    //         response.code = StatusCodes.BAD_REQUEST;
    //         break;
    // }
    // // check error by code
    // if (err.code && err.code === 11000) {
    //   response.messageEn = `Duplicate value entered for ${Object.keys(err.keyValue)} failed , please choose another value`;
    //   response.code = StatusCodes.BAD_REQUEST;
    // }
    console.log("error---------------------");
    console.log(err);
    return res.status(err.code || StatusCodes.INTERNAL_SERVER_ERROR,).json(response.toJson());
}

module.exports = errorHandlerMiddleware;
