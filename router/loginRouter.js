// external imports 
const express = require("express");

// internal imports 
const {getLogin, login, logout} = require("../controller/loginController");
const decoratHtmlRes = require("../middlewears/common/decoratHtmlRes");
const {redirectLogedIn} = require("../middlewears/common/checkLogin")

const router = express.Router();

router.get("/", decoratHtmlRes("login"),redirectLogedIn, getLogin);
router.post("/",decoratHtmlRes("login"), login);
router.delete("/", logout);

module.exports = router;