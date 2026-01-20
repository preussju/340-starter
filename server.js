/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts") 
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")

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
app.use(static)
//app.get("/", function (req, res) {
// res.render("index",{title:"Home"})
//})

app.get("/", baseController.buildHome)  //M-V-C methodology.

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
