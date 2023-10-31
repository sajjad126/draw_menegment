const Statement = require("../models/statement");

async function getModerator(req, res, next){
    try {
        const statements = await Statement.find({
            mainAccept: false,
        });
        res.locals.statements = statements,
    // console.log(statements)
        res.render("moderator")
        
    } catch (error) {
        console.log(error);
    }
}
async function acceptMoney(req, res, next){
    try {
        const statement = await Statement.updateOne({_id: req.params.id},{
            $set:{
                mainAccept: true,
            }
        },{upsert:true, useFindAndModify:false},function(err, doc){
            if(err){
                console.log(err)
            }else{
                res.status(200).json({msg: "update succes"});
            }
        });
        res.redirect("/moderator")
    } catch (error) {
        console.log(error)
    }
}

module.exports= {
    getModerator,
    acceptMoney
}