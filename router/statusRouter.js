// external imports 
const express = require("express");

// internal imports 
const {getStatus} = require("../controller/statusController");
const decoratHtmlRes = require("../middlewears/common/decoratHtmlRes");
const {checkLogin} = require("../middlewears/common/checkLogin")

const router = express.Router();

router.get("/", decoratHtmlRes("status"),checkLogin, getStatus);

module.exports = router;