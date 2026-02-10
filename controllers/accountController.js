const jwt = require("jsonwebtoken")
require("dotenv").config()

const bcrypt = require("bcryptjs")
const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}


/* ****************************************
*  Deliver update view
* *************************************** */
async function buildUpdate(req, res, next) {
  let nav = await utilities.getNav()

  const account_id = parseInt(req.params.accountId)
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update", {
    title: "Edit Account",
    nav,
    errors: null,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
    account_id: accountData.account_id
  })
}


/* ****************************************
*  Deliver management view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors: null
  })
}


/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).redirect("/account/", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Process Update
* *************************************** */
async function updateAccountData(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const regResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id,
  )

  if (regResult) {
    const updatedData = await accountModel.getAccountById(account_id)
    req.session.accountData = updatedData
    req.flash(
      "notice",
      `Your account has been updated, ${account_firstname}!`
    )
    res.status(201).redirect("/account")  
    
  } else {
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("/account", {
      title: "Edit Account",
      nav,
      errors: null,
      account_firstname,
      account_lastname,
      account_email,
      account_id,
    })
  }
}

/* ****************************************
* Process Password Update
* *************************************** */
async function updatePasswordAccountData(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the password update.')
    return res.status(500).render("account/update")
  }

  const updateResult = await accountModel.updatePassword(
    hashedPassword, 
    account_id
  )

  if (updateResult) {
    req.flash("notice", "Password updated successfully.")
    res.status(201).redirect("/account/")   
  } else {
    req.flash("notice", "Sorry, the password update failed.")
    res.status(501).render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id,
    })
  }
}


/* ****************************************
 *  logs out 
 * ************************************ */

async function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout error:", err)
      return res.redirect("/") 
    }
    res.clearCookie("sessionId", { path: "/" }) // clear cookie
    res.clearCookie("jwt", { path: "/" }) //clear jwt
    res.redirect("/") // back to home
  })
}



module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccountManagement, logout, buildUpdate, updateAccountData, updatePasswordAccountData}