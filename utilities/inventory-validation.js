const invModel = require("../models/inventory-model")

const utilities = require(".")
  const { body, validationResult } = require("express-validator")
const validate = {}
    
validate.inventoryRules = () => {
  return [
    body("classification_id")
      .notEmpty()
      .withMessage("Please select a classification."),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 }) 
      .withMessage("Please provide a make (at least 3 characters)."),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Please provide a model (at least 3 characters)."),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a description."),

    body("inv_image")
      .trim()
      .matches(/^\/images\/vehicles\/.*\.(jpg|jpeg|png)$/)
      .withMessage("Image path must be in /images/vehicles/ and end with .jpg, .jpeg, or .png."),

    body("inv_thumbnail")
      .trim()
      .matches(/^\/images\/vehicles\/.*\.(jpg|jpeg|png)$/)
      .withMessage("Thumbnail path must be in /images/vehicles/ and end with .jpg, .jpeg, or .png."),

      body("inv_price")
      .notEmpty()
      .isFloat({ min: 0 })
      .withMessage("Price must be a positive number."),

      body("inv_year")
      .notEmpty()
      .isInt({ min: 1900, max: new Date().getFullYear() + 1 })
      .withMessage("Please provide a valid year."),

      body("inv_miles")
      .notEmpty()
      .isInt({ min: 0 })
      .withMessage("Miles must be a non-negative integer."),

      body("inv_color")
      .notEmpty()
      .trim()
      .matches(/^[A-Za-z ]+$/)
      .withMessage("Color must contain only letters and spaces."),
  ]
}


validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Classification name is required.")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("Classification name must contain only letters and numbers, with no spaces or special characters."),
  ]
}


/* ******************************
 * Check classification data 
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", {
      errors,
      title: "Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

/* ******************************
 * Check inventory data
 * ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

/* ******************************
 * edit/update inventory data
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    inv_id,
  } = req.body

  let errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit Inventory",
      nav,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      inv_id,
    })
    return
  }
  next()
}

/* **********************************
 * Review Validation Rules
 * ********************************* */
validate.reviewRules = () => {
  return [
    body("rev_text")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a review text."),

    body("rev_rate")
      .trim()
      .isInt({ min: 1, max: 5 })
      .withMessage("Rating must be a number between 1 and 5."),
    
    body("inv_id").isInt().withMessage("Invalid inventory ID."),
    body("account_id").isInt().withMessage("Invalid account ID."),
  ]
}

/* ******************************
 * Check review data and return errors
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { rev_text, rev_rate, inv_id, account_id } = req.body
  let errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const invModel = require("../models/inventory-model")
    const utilities = require("../utilities/")
    
    const data = await invModel.getInventoryByDetailId(inv_id)
    const reviews = await invModel.getReviewById(inv_id)
    const nav = await utilities.getNav()
    const grid = await utilities.buildDetailGrid(data, res.locals.loggedin, res.locals.accountData, reviews)
    
    res.render("inventory/detail", {
      title: `${data.inv_make} ${data.inv_model}`,
      nav,
      grid,
      errors: errors.array(),
      rev_text,
      rev_rate
    })
    return
  }
  next()
}


module.exports = validate