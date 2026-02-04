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
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
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
    })
    return
  }
  next()
}



module.exports = validate