// Needed Resources
const regValidate = require('../utilities/account-validation')

const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build details by classification view
router.get("/detail/:detailId", invController.buildBydetailId);
//
router.get("/", invController.buildManagement);
//
router.get("/new-classification", utilities.handleErrors(invController.buildAddClassification));
//
router.get("/new-item", utilities.handleErrors(invController.buildAddItem));
// input
router.post('/new-classification', invController.registerClassification);
router.post("/new-classification", (req, res) => { res.status(200).send('adding process') })


module.exports = router;