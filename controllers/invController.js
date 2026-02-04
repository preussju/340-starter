const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
    if (!data || data.length === 0) {
    const err = new Error("Ops! Page not found")
    err.status = 404
    return next(err)
  }
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
    errors: null,
  })
}

/* ***************************
 *  Build inventory by detail view
 * ************************** */
invCont.buildBydetailId= async function (req, res, next) {
  const detail_id = req.params.detailId
  const data = await invModel.getInventoryByDetailId(detail_id)
  if (!data) {
    const err = new Error("Ops! Vehicle not found")
    err.status = 404
    return next(err)
  }
  const grid = await utilities.buildDetailGrid(data)
  let nav = await utilities.getNav()
  const className = data.inv_year + ' ' + data.inv_make + ' ' + data.inv_model 
  res.render("./inventory/detail", {
    title: className,
    nav,
    grid,
    errors: null,
  })
}

/* management view */

invCont.buildManagement= async function (req, res, next) {
let nav = await utilities.getNav()
  res.render("./inventory/management", {
    title: "New Content",
    nav,
    errors: null,
  })
}


invCont.buildAddClassification = async function (req, res, next) {
let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
  })
}

invCont.buildAddItem = async function (req, res, next) {
let nav = await utilities.getNav()
  res.render("./inventory/add-item", {
    title: "Add New Item",
    nav,
    errors: null,
  })
}


/* ****************************************
*  Process Registration
* *************************************** */

  invCont.registerClassification = async function (req, res, next) {
    
    const { classification_name} = req.body

    const regResult = await invModel.registerClassification(classification_name)
    let nav = await utilities.getNav()
    
    if (regResult) {
      req.flash( "notice", `Congratulations, you registered a new classification!`)
      res.status(201).render("inventory/management", {
        title: "Registration",
        nav,
        errors: null,
    })
      
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/management", {
          title: "Registration",
          nav,
          errors: null,
        })
      }
  }

  module.exports = invCont;
