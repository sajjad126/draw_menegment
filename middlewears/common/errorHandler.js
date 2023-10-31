const createError = require("http-errors");

function notFoundHandler(req, res, next){
    next(createError(404, "your requested content was not found!"))
};

// default error handler 
function errorHandler(err, req, res, next){
    res.locals.title = "error page";
    res.locals.error = err
    res.render("error");
}

module.exports = {
    notFoundHandler,
    errorHandler,
}