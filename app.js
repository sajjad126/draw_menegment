// external imports 
const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");

// internal imports 
const statusRouter = require("./router/statusRouter");
const loginRouter = require("./router/loginRouter");
const usersRouter = require("./router/usersRouter");
const pickerRouter = require("./router/pickerRouter")
const moderatorRouter = require("./router/moderatorRouter")
const {notFoundHandler, errorHandler} = require("./middlewears/common/errorHandler")

const app = express();

dotenv.config();

// database connection
mongoose.connect(process.env.MONGO_CONNECTION_STRING,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=> console.log("database conntection succes"))
.catch(err => console.log(err))

// request parser 
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// ser view engine 
app.set("view engine", "ejs");

// set static folder 
app.use(express.static(path.join(__dirname, "public")));

// parsre cookie 
app.use(cookieParser(process.env.COOKIE_SECRET));

// routing setup 
app.use("/", statusRouter)
app.use("/login", loginRouter)
app.use("/users", usersRouter)
app.use("/picker", pickerRouter)
app.use("/moderator", moderatorRouter)

// error handling 
// 404 not found handler 
app.use(notFoundHandler)

// common error handler 
app.use(errorHandler)

app.listen(process.env.PORT, ()=>{
  console.log(`app listening to port ${process.env.PORT} `)
})