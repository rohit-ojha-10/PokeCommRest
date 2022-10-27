require('dotenv').config()
const cors = require('cors')
const bcrypt = require('bcrypt')
const express = require('express')
const mongoose = require('mongoose')
const Creds = require('./models/credentialModel')
const credentialModel = require('./models/credentialModel')
const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true }).then((res) => console.log("connected"))
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log("database connected"))
let isLoggedIn = 0;
const PORT = process.env.PORT || 3001
app.get('/credential',async (req,res) => {
    // console.log(req.query.username)
    try {
        const data = await Creds.find()
         res.json(data)
    } catch (error) {
      res.status(500).send({message : error.message})   
    }
}) 
app.post('/credential/login',async(req,res) => {
    console.log(req.body.password)
    try {
        const data = await Creds.where("username").equals(req.body.username)
        console.log(data[0].password)
        if(await bcrypt.compare(req.body.password,data[0].password)){
            isLoggedIn = 1;
            console.log("Password Matches")
            res.send("0")
        }
        else{
            console.log("ERROR")
            res.send("1")
        }
    } catch (error) {
        res.json({message : error.message})
    }
})
app.get('/checklogin', (req,res) => {
    res.json({isTrue : isLoggedIn})
})
app.post('/credential',async (req,res) => {
    // res.send(req.body.name)
    // res.json(newCred)
    console.log("here i am")
    try {
        const password = req.body.password
        const encrypt = await bcrypt.hash(password,10)
        const newCred = new Creds({
            name : req.body.name,
            username : req.body.username,
            password : encrypt
        })
         await newCred.save()
         res.status(201).send("added to database")
    } catch (error) {
        res.status(400).send({message : error.message})
    }
})
app.delete('/deleteAll',async (req,res) => {
    await credentialModel.deleteMany({})
    res.send("deleted")
})
app.listen(PORT, () => {
    console.log("server created")
})