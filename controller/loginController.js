const People = require("../models/people.js")
const jwt  = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const createError = require("http-errors")

function getLogin(req, res, next){
    res.render("login")
};

async function login(req, res, next){
    
    try {
        const user = await People.findOne({
            mobile: req.body.mobile,
        });
        
        if(user && user._id){
            // if(user.password == req.body.password){
            if(await bcrypt.compare(req.body.password , user.password)){
                
                const userObject = {
                    id: user._id,
                    username: user.name,
                    mobile: user.mobile,
                    role: user.role
                }
                const token = jwt.sign( userObject, process.env.COOKIE_SECRET, {
                    expiresIn: process.env.JWT_EXPAIRY,
                });

                res.cookie(process.env.COOKIE_NAME, token,{
                    maxAge: process.env.JWT_EXPAIRY,
                    httpOnly: true,
                    signed: true
                });

                res.locals.logedInUser = userObject;
                console.log(`loged in ${user.role + " "+ user.name}`);
                res.redirect("/");
            }else{
                throw createError("login failed!");
             }
        }else{
            throw createError("login failed!");
        }
    } catch (error) {
        res.render("login", {
            errors: error.message,
            data: {
                userName: req.body.name,
            }
        })
        console.log(error)
    }
}

function logout(req, res){
    res.clearCookie("draw app");
    res.send("cookie delete");
    console.log(`logouted `)
}

module.exports = {
    getLogin,
    login,
    logout,
}