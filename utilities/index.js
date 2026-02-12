const jwt = require("jsonwebtoken")
require("dotenv").config()

const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  //console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

//module.exports = Util

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors"/></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the detail view HTML and review
* ************************************/
Util.buildDetailGrid = async function(data, loggedin, accountData, reviews){
  let grid
  if(data){
    grid = `
    <div class="detail-grid">
      <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
      <div id="detail-display">
        <h2>${data.inv_make} ${data.inv_model}</h2>
        <p><span class="label">Price: $${new Intl.NumberFormat('en-US').format(data.inv_price)}</span></p>
        <p>${data.inv_description}</p>
        <p><span class="label">Color:</span> ${data.inv_color}</p>
        <p><span class="label">Miles:</span> ${new Intl.NumberFormat('en-US').format(data.inv_miles)}</p>
      </div>
    </div>
    `
  grid += `<hr><div class="reviews-section">`
  grid += `<h3>Customer Reviews</h3>`

  if (reviews && reviews.length > 0) {
    grid += `<ul id="review-list">`
    reviews.forEach(review => {
      const date = new Date(review.rev_date).toLocaleDateString()
      grid += `
        <li>
          <p><strong>${review.account_firstname}</strong> wrote on ${date}:</p>
          <p class="review-text">"${review.rev_text}"</p>
          <p class="review-rating">Rating:<strong> ${review.rev_rate}/5</strong></p>
        </li>`
    })
    grid += `</ul>`
  } else {
    grid += `<p class="no-reviews">Be the first to write a review!</p>`
  }

    if (loggedin) {
      grid += `
      <div class="review-form">
        <form id="reviewForm" action="/inv/detail/${data.inv_id}" method="post">
          <p>Logged in as: <strong>${accountData.account_firstname}</strong></p>
          
          <label for="rev_rate">Rating (1-5):</label><br>
          <input type="number" name="rev_rate" id="rev_rate" min="1" max="5" required><br>

          <label for="rev_text">Your Review:</label><br>
          <textarea name="rev_text" id="rev_text" required placeholder="Write your opinion here..."></textarea><br>

          <input type="submit" value="Submit Review">

          <input type="hidden" name="inv_id" value="${data.inv_id}">
          <input type="hidden" name="account_id" value="${accountData.account_id}">
        </form>
      `
    } else {
      grid += `<p class="notice-review">Please <a href="/account/login">Login</a> to write a review.</p>`
    }
    grid += `</div>`
  } else { 
    grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
} 


/* **************************************
* Build the classification select form field HTML
* ************************************/

Util.buildClassificationList = async function (classification_id = null) {
    let data = await invModel.getClassifications()
    let classificationList =
      '<select name="classification_id" id="classificationList" required>'
    classificationList += "<option value=''>Choose a Classification</option>"
    data.rows.forEach((row) => {
      classificationList += '<option value="' + row.classification_id + '"'
      if (
        classification_id != null &&
        row.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + row.classification_name + "</option>"
    })
    classificationList += "</select>"
    return classificationList
}
  

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
 if (req.cookies.jwt) {
  jwt.verify(
   req.cookies.jwt,
   process.env.ACCESS_TOKEN_SECRET,
   function (err, accountData) {
    if (err) {
     req.flash("Please log in")
     res.clearCookie("jwt")
     return res.redirect("/account/login")
    }
    res.locals.accountData = accountData
    res.locals.loggedin = 1
    next()
   })
 } else {
  next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util;

