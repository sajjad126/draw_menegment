const People = require("../models/people");
async function getPicker(req, res, next){
    try {
        const pendding_users = await People.find({
            draw_stat: false,
        });
        const wined_users = await People.find({
            draw_stat: true,
        });
        wined_users.sort(function(a, b){
            // return a-b
            return a.draw_win-b.draw_win
        })
        res.render("picker",{
            pendding_users,
            wined_users,
        })
    } catch (error) {
        next(error)
    }
    
};

async function getPick(req, res, next){
    try {
        const pendding_users = await People.find({
            draw_stat: false,
        });
        const randomNum = Math.floor((Math.random() * pendding_users.length) + 1);
        const winedName = pendding_users[randomNum-1];
        // console.log(randomNum)
        // console.log(winedName)
        winedName.password = ""
        res.status(200).json({
            wined: winedName,
        })
    } catch (error) {
        
    }
}

async function updateWins(req, res, next){
    try {
        const user = await People.updateOne({_id: req.params.id},{
            $set:{
                draw_stat: true,
                draw_win: Number(res.locals.user_basic.draw_no)+1
            }
        },{upsert:true, useFindAndModify:false},function(err, doc){
            if(err){
                console.log(err)
            }else{
                res.status(200).json({msg: "update succes"});
            }
        });
        res.redirect("/picker");
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getPicker,
    getPick,
    updateWins
}