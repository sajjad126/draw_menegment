// external imports 
const express = require("express");

// internal imports 
const {getPicker, getPick, updateWins} = require("../controller/pickerController");
const decoratHtmlRes = require("../middlewears/common/decoratHtmlRes");
const {checkLogin, requireRole} = require("../middlewears/common/checkLogin")

const router = express.Router();

router.get("/",decoratHtmlRes("picker"),checkLogin, getPicker);
router.get("/pick",decoratHtmlRes("picker"),checkLogin, getPick);
router.post("/:id",decoratHtmlRes("Users"),checkLogin,requireRole(["admin","moderator"]), updateWins)

module.exports = router;