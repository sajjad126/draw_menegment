
function decoratHtmlRes(page_title){
    return async function(req, res, next){
        
        res.locals.counterArr = [];
        res.locals.title= `${page_title} - ${process.env.APP_NAME}`;
        res.locals.logedInUser = {};
        res.locals.statements = [];
        next();
    }
};

module.exports = decoratHtmlRes;