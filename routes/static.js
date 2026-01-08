const express = require('express');
const router = express.Router();

// Static Routes
// Set up "public" folder / subfolders for static files
router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

module.exports = router;



//Line 1 - The express package is brought into the scope of the file and assigned to a local variable.
//Line 2 - The Express "router" functionality is invoked and stored into a local variable for use. Notice the (), indicating that Router is a function.
//Lines 4 & 5 - Comments
//Line 6 - Indicates that the Express router is to "use" the "express.static" function, meaning this is where static resources will be found, with the public folder.
//Line 7 - Indicates that any route that contains /css is to refer to the public/css folder, which is found at the root level of the project.
//Line 8 - Indicates that any route that contains /js is to refer to the public/js folder, which is found at the root level of the project.
//Line 9 - Indicates that any route that contains /images is to refer to the public/images folder, which is found at the root level of the project.
//Lines 7, 8 and 9 allow you to write paths pointing to these resources easily and also to add the subfolders for images, CSS and JavaScript and have them still operate correctly.
//Line 11 - Exports the router object, along with all of these use statements for use in other areas of the application. This is VERY IMPORTANT. If a resource is NOT exported, it cannot be used somewhere else.