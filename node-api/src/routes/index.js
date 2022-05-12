const express = require('express');

// const pdf = require('./pdf');
const email = require('./email');
const user = require('./user');
const comments = require('./order');

function getRoutes(){
    // router for all routes of our app
    const router = express.Router();

    //router.use('/docs', pdf.getPDFRoutes());
    router.use('/email', email.getEmailRoutes());
    router.use('/user', user.getAuthenticationRoutes());
    router.use('/order', comments.getOrderCommentRoutes());

    return router;
}
module.exports.getRoutes = getRoutes;
