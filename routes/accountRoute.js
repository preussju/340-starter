// Needed Resources
const regValidate = require('../utilities/account-validation')

const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/index")

//login view 
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//registration view 
router.get("/register", utilities.handleErrors(accountController.buildRegister));
//register the input
router.post('/register', regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))


module.exports = router;