/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

const session = require("express-session")
const pool = require('./database/')

/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts") 
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const accountRoute = require("./routes/accountRoute")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities/")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")


/* ***********************
 * Middleware
 * ************************/
 app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
 }))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(cookieParser())
app.use(utilities.checkJWTToken)

/* ***********************
 * View Engine and Templates
 *************************/

app.set("view engine", "ejs")  // ejs - view engine for our application
app.use(expressLayouts) // express-ejs-layouts package in the variable
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/

//index route
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)//account route 
app.use(static)
//app.get("/", function (req, res) {
// res.render("index",{title:"Home"})
//})
//app.get("/", baseController.buildHome)  //M-V-C methodology.
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", utilities.handleErrors(inventoryRoute))
app.use("/inv/new-classification", utilities.handleErrors(inventoryRoute))
app.use("/inv/new-inventory", utilities.handleErrors(inventoryRoute))

// File Not Found Route - must be last route in list
app.get("/error", (req, res, next) => {
    next({status: 500, message: 'Intentional 500 error for testing.'})
})

app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/

app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if (err.status == 404) { message = err.message } else if (err.status == 500) {message = "There was a Intentional car crash | 500 error for testing."}  else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status + ' Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/

const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/

app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
