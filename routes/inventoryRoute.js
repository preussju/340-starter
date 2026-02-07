// Needed Resources
const regValidate = require('../utilities/inventory-validation')
const accountValidate = require('../utilities/account-validation')
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")


// Route to build inventory by classification view
router.get("/type/:classificationId",
    invController.buildByClassificationId);
// Route to build details by classification view
router.get("/detail/:detailId",
    invController.buildBydetailId);
// Route to inventory edit management view
router.get("/",
    accountValidate.checkAccountType,
    invController.buildManagement);
//
router.get("/edit/:detailId",
    accountValidate.checkAccountType,
    utilities.handleErrors(invController.editBydetailId));
// Route to inventory delete management viewv
router.get("/delete/:detailId",
    accountValidate.checkAccountType,
    utilities.handleErrors(invController.deleteBydetailId));//
//js route
router.get("/getInventory/:classification_id",
    utilities.handleErrors(invController.getInventoryJSON))
//
router.get("/new-classification",
    accountValidate.checkAccountType,
    utilities.handleErrors(invController.buildAddClassification));
//
router.get("/new-inventory",
    accountValidate.checkAccountType,
    utilities.handleErrors(invController.buildAddInventory));
// input
router.post('/new-classification',
    accountValidate.checkAccountType,
    regValidate.classificationRules(),
    regValidate.checkClassificationData,
    utilities.handleErrors(invController.registerClassification));
//router.post("/new-classification", (req, res) => { res.status(200).send('adding process') })

router.post('/new-inventory',
    accountValidate.checkAccountType,
    regValidate.inventoryRules(),
    regValidate.checkInventoryData,
    invController.registerInventory);
//router.post("/new-inventory", (req, res) => { res.status(200).send('adding process') })
//edit inv
router.post("/edit/",
    accountValidate.checkAccountType,
    regValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));
//regValidate.newInventoryRules()
//delete inv
router.post("/delete/",
    accountValidate.checkAccountType,
    utilities.handleErrors(invController.deleteInventory));//

module.exports = router;