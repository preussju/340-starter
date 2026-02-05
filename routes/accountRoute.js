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
//account management view
router.get("/",  utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

//register the input
router.post('/register', regValidate.registrationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))
//login input
router.post('/login', regValidate.LoginRules(), regValidate.checkLoginData, utilities.handleErrors(accountController.accountLogin))
// Process the login attempt
//router.post("/login", (req, res) => { res.status(200).send('login process') })



module.exports = router;