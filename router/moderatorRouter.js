// external imports 
const express = require("express");

// internal imports 
const decoratHtmlRes = require("../middlewears/common/decoratHtmlRes");
const {checkLogin, requireRole} = require("../middlewears/common/checkLogin");
const { getModerator, acceptMoney } = require("../controller/moderatorController");

const router = express.Router();

router.get("/",decoratHtmlRes("moderator"),checkLogin,requireRole(["moderator"]), getModerator);
router.post("/:id",checkLogin,requireRole(["moderator"]), acceptMoney);

module.exports = router;