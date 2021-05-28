const express = require("express")
const path = require("path")
const app = express()


//Express using PUG templating Engine, look for templates in the view folder
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

// Initializing our server
app.get('/', (req, res) => res.render("index"))
app.listen(3000, () => console.log("Server Ready"))