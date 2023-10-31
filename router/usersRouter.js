// external imports 
const express = require("express");

// internal imports 
const {getUsers,getOneUser, addUser, removeUser, addMoney} = require("../controller/usersController");
const decoratHtmlRes = require("../middlewears/common/decoratHtmlRes");
const {checkLogin, requireRole} = require("../middlewears/common/checkLogin")

const router = express.Router();

router.get("/", decoratHtmlRes("users") , checkLogin,requireRole(["admin","moderator"]), getUsers);
router.get("/:id", decoratHtmlRes("users") , checkLogin,requireRole(["admin","moderator"]), getOneUser);
router.post("/",checkLogin,requireRole(["moderator"]), addUser);
router.post("/:id",checkLogin,requireRole(["admin","moderator"]), addMoney);
router.delete("/:id",checkLogin,requireRole(["moderator"]), removeUser);


module.exports = router;