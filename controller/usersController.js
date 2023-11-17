const People = require("../models/people.js");
const Statement = require("../models/statement.js");
const bcrypt = require("bcrypt");

async function getUsers(req, res, next){
    
    try {
        const users = await People.find();
        res.render("users",{
        users: users,
    })
    } catch (error) {
        next(error)
    }
};

async function getSetting(req, res, next){
    try {
        const user = await People.findOne({
            _id: req.params.id,
        });
        user.password = "";
        res.render("setting",{
            user: user,
        })
    } catch (error) {
        
    }
}

async function updateUser(req, res, next){
    try {
        const user = await People.findOne({
            _id: req.params.id,
        });
        if(user && user._id){
            if(await bcrypt.compare(req.body.password , user.password)){
                if(req.body.new_password && req.body.new_password == req.body.re_enter_password){
                    // console.log(req.body)
                    const hashedPassword = await bcrypt.hash(req.body.new_password,10);
                    console.log(hashedPassword);
                    const update = await People.updateOne({_id: req.params.id},{
                        $set:{
                            name: req.body.name,
                            user_name: req.body.user_name,
                            role: req.body.role,
                            mobile: req.body.mobile,
                            password: hashedPassword,
                        }
                    },{upsert:true, useFindAndModify:false},function(err, doc){
                        if(err){
                            console.log(err)
                        }else{
                            res.status(200).json({msg: "update succes"});
                        }
                    });
                    res.redirect("/");

                }else{
                    // console.log("hello")
                    const update = await People.updateOne({_id: req.params.id},{
                        $set:{
                            name: req.body.name,
                            user_name: req.body.user_name,
                            role: req.body.role,
                            mobile: req.body.mobile,
                        }
                    },{upsert:true, useFindAndModify:false},function(err, doc){
                        if(err){
                            console.log(err)
                        }else{
                            res.status(200).json({msg: "update succes"});
                        }
                    });
                    res.redirect("/");
                }
            }else{
                res.redirect(`/users`)
            }
        }
        
    } catch (error) {
        
    }
}

async function getOneUser(req, res, next){
    try {
        
        const statements = await Statement.find({
            ownerId: req.params.id,
        });
        const oneUser = await People.find({
            _id: req.params.id,
        });
        let logedInUser = {
            id: oneUser[0]._id,
            username: oneUser[0].name,
            mobile: oneUser[0].mobile,
        }
        const startForm = await Statement.findOne({
            ownerId: "starting_form"
        });
        

        // find user info 

        // this code day counter 
        let now = new Date(); 
        var Difference_In_Time = now.getTime() - startForm.date.getTime();
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        const counterArr = Math.ceil(Difference_In_Days).toString().split("");
        if(Difference_In_Days => 100){
            counterArr.shift();
            counterArr[0] = Number(counterArr[0])+10;
        }
        counterArr.push(startForm.money);
        if(counterArr[1]== 0){
            counterArr[0] = counterArr[0]-1
            counterArr[1] = 10;
        }

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

        const filterStatements = statements.filter(function (statement){
            return ((statement.date.getTime()- startForm.date.getTime())/ (1000 * 3600 * 24)) > res.locals.user_basic.draw_no*10;
        });

        res.locals.user_basic = userBasic;

        if(req.query.stat == "all"){
            res.locals.statements = statements.reverse();
        }else{
            res.locals.statements = filterStatements.reverse();
        }
        res.render("status",{
        logedInUser: logedInUser,
    }) 
    } catch (error) {
        next(error)
    }
};

async function addUser(req, res){
    // newUser = new User({...req.body,});
    const hashedPassword = await bcrypt.hash(req.body.password , 10)
    try {
        const doc =  new People({
            name:req.body.name,
            user_name:req.body.user_name,
            mobile:req.body.mobile,
            password: hashedPassword,
            role:req.body.role,
        })
        await doc.save();
        res.redirect("/users")
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}
async function addMoney(req, res){

    try {
        const people = await People.findOne({
            _id : req.params.id,
        })
        const doc =  new Statement({
            ownerId:req.params.id,
            ownerName: people.name,
            money:req.body.money,
            acceptedBy:res.locals.logedInUser.username,
            date: req.body.datetime || new Date,
        })
        await doc.save();
        res.redirect("/users")
    } catch (err) {
        console.log(err)
        res.status(500).json(err)
    }
}

async function removeUser(req, res, next){
    try {
        const statements = await Statement.deleteMany({
            ownerId: req.params.id
        });
        const user = await People.deleteOne({
            _id: req.params.id
        });
    } catch (error) {
        next(error)
    }
}



module.exports = {
    getUsers,
    getSetting,
    updateUser,
    getOneUser,
    addUser,
    addMoney,
    removeUser,
}