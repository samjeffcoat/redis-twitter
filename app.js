const express = require("express")
const path = require("path")
const bcrypt = require('bcrypt')
const redis = require('redis')
const session = require('express-session')
const RedisStore = require('connect-redis')(session)
const app = express()
const client = redis.createClient()
app.use(express.urlencoded({extended: true}))
app.use(
    session({
        store: new RedisStore({client: client}),
        resave: true,
        saveUninitialized: true,
        cookie: {
            maxAge: 36000000,
            httpOnly: false,
            secure: false,
        },
        secret: 'bM80SARMxlq4fiWhulfNSeUFURWLTY8vyf',
    })
)

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
    client.hget('users', username, (err, userid) => {
    if(!userid){
        //user does not exist, signup procedure
        client.incr('userid', async (err, userid) => {
            client.hset('users', username, userid)
            const saltRounds = 10
            const hash = await bcrypt.hash(password, saltRounds)
            client.hset(`user:${userid}`, 'hash', hash, 'username', username)
        })
    } else {
        //user exists, login procedure
        client.hget(`user:${userid}`, 'hash', async (err, hash) => {
            const result = await bcrypt.compare(password, hash)
            if(result) {
                //password was ok
            } else {
                //wrong password
            }
        })
    }
})




    res.end()
})


