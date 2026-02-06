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
  const classificationList = await utilities.buildClassificationList()
  res.render("./inventory/management", {
    title: "New Content",
    nav,
    classificationList,
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

invCont.buildClassificationList= async function(req, res) {
  const classifications = await invModel.getInventoryByClassificationId();

  const classificationList = utilities.buildClassificationList(classifications);
  res.render('inventory/add-inventory', {
        classificationList: classificationList // This is the variable the view will use
  });
};


invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationData = await invModel.getClassifications() 
  const classificationList = await utilities.buildClassificationList(classificationData)

  res.render("./inventory/add-inventory", {
    title: "Add New Item",
    nav,
    classificationList,
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
    const classificationData = await invModel.getClassifications()
    const classificationList = await utilities.buildClassificationList(classificationData)
      
    if (regResult) {
      req.flash("notice", `Congratulations, you registered a new classification!`)

      res.status(201).render("inventory/management", {
        title: "Registration",
        nav,
        classificationList,
        errors: null,
    })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/management", {
          title: "Registration",
          nav,
          classificationList,
          errors: null,
        })
      }
  }


  invCont.registerInventory = async function (req, res, next) {
    
    const {classification_id,inv_make,inv_model,inv_description,inv_image,inv_thumbnail,inv_price,inv_year,inv_miles,inv_color} = req.body//
    const regResult = await invModel.registerInventory(classification_id,inv_make,inv_model,inv_description,inv_image,inv_thumbnail,inv_price,inv_year,inv_miles,inv_color)//
    let nav = await utilities.getNav()
    const classificationData = await invModel.getClassifications()
    const classificationList = await utilities.buildClassificationList(classificationData)

    if (regResult) {
      req.flash( "notice", `Congratulations, you registered a new inventory item!`)
      res.status(201).render("inventory/management", {
        title: "Registration",
        nav,
        classificationList,
        errors: null,
    })
      
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("inventory/management", {
          title: "Registration",
          nav,
          classificationList,
          errors: null,
        })
      }
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}



/* ***************************
 *  edit inventory view by id
 * ************************** */

invCont.editBydetailId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.detailId)

  const itemData = await invModel.getInventoryByDetailId(inv_id)

  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}


/* ***************************
 *  delete inventory view by id
 * ************************** */

invCont.deleteBydetailId = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.detailId)

  const itemData = await invModel.getInventoryByDetailId(inv_id)

  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/delete-inventory", {
    title: "Delete" + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const deleteResult = await invModel.deleteInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the delet failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}



  module.exports = invCont;
