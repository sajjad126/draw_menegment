const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const Statement = require("../../models/statement");

const checkLogin = async (req, res, next) => {
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
    if(cookies){
        try {
            token = cookies[process.env.COOKIE_NAME];
            const decoded = jwt.verify(token, process.env.COOKIE_SECRET);
            req.user = decoded;
            res.locals.logedInUser = decoded;
            
            // this code day counter 
            const startForm = await Statement.findOne({
                ownerId: "starting_form"
            });
            let now = new Date(); 
            var Difference_In_Time = now.getTime() - startForm.date.getTime();
            var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
            const counterArr = Math.ceil(Difference_In_Days).toString().split("");
            counterArr.push(startForm.money);
            if(counterArr[1]== 0){
                counterArr[0] = counterArr[0]-1
                counterArr[1] = 10;
            }

            const statements = await Statement.find({
                ownerId: decoded.id
            })
            let totalDeposit = 0;
            statements.forEach((statement)=>{
                totalDeposit += statement.money;
            })
            const userBasic = {
                draw_no: counterArr[0] || 0,
                draw_day: counterArr[1] || 1,
                total_deposit: totalDeposit||0, 
                running_deposit: totalDeposit-Number(counterArr[0])*1000||0,
                due: (Number(counterArr[0])*1000)+Number(counterArr[1]*100)-totalDeposit||0,
            }
        // console.log({userBasic});
            res.locals.user_basic = userBasic;
            next()
        } catch (error) {
            res.redirect("/login")
        }
    }else{
        res.redirect("/login")
    }
};

const  redirectLogedIn = (req, res, next) =>{
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
    if(!cookies){
        next();
    }else{
        res.redirect("/");
    }
}

function requireRole(role){
    return function(req, res, next){
        if(req.user.role && role.includes(req.user.role)){
            next();
        }else{
            next(createError(401, "you are not authorized to access this page"));
        }
    }
}

module.exports = {
    checkLogin,
    redirectLogedIn,
    requireRole
};