const Statement = require("../models/statement");

async function getStatus(req, res, next){
    
    try {
        
        const statements = await Statement.find({
            ownerId: res.locals.logedInUser.id,
        });

        const startForm = await Statement.findOne({
            ownerId: "starting_form"
        });
        const filterStatements = statements.filter(function (statement){
            return ((statement.date.getTime()- startForm.date.getTime())/ (1000 * 3600 * 24)) > res.locals.user_basic.draw_no*10;
        });
        if(req.query.stat == "all"){
            res.locals.statements = statements.reverse();
        }else{
            res.locals.statements = filterStatements.reverse();
        }
        res.render("status") 
    } catch (error) {
        next(error)
    }
};

module.exports = {
    getStatus,
}