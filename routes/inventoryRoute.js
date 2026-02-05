// Needed Resources
const regValidate = require('../utilities/inventory-validation')

const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build details by classification view
router.get("/detail/:detailId", invController.buildBydetailId);
//js route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))
//
router.get("/", invController.buildManagement);
//
router.get("/new-classification", utilities.handleErrors(invController.buildAddClassification));
//
router.get("/new-inventory", utilities.handleErrors(invController.buildAddInventory));
// input
router.post('/new-classification', regValidate.classificationRules(), regValidate.checkClassificationData, utilities.handleErrors(invController.registerClassification));
//router.post("/new-classification", (req, res) => { res.status(200).send('adding process') })

router.post('/new-inventory', regValidate.inventoryRules(), regValidate.checkInventoryData, invController.registerInventory);
//router.post("/new-inventory", (req, res) => { res.status(200).send('adding process') })

module.exports = router;