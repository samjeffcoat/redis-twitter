const express = require("express")
const path = require("path")
const app = express()
app.use(express.urlencoded({extended: true}))


//Express using PUG templating Engine, look for templates in the view folder
app.set("view engine", "pug")
app.set("views", path.join(__dirname, "views"))

// Initializing our server
app.get('/', (req, res) => res.render("index"))
app.listen(3000, () => console.log("Server Ready"))


// Creating a post endpoing

app.post("/", (req, res) => {
    const {username, password} = req.body

    if(!username || !password){
        res.render("error", {
            message: "Please set both username and password"
        })
        return
    }
    console.log(req.body, username, password)
    res.end()
})