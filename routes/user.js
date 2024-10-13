const {Router} = require("express");
const {userModel} = require("../db");
const bcrypt = require("bcrypt");
const zod = require("zod");

const userRouter = Router();  

  userRouter.post("/signup", async function(req, res) {
    const {email, password, firstName, lastName} = req.body;

try {
   await userModel.create({
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName
    })
        res.json({
            message: "signup succeeded"
        })

    } 

catch(error) {
    res.status(500).json({
        message: "Signup failed",
        error: error.message
    })
}
})
    
    userRouter.post("/signin", function(req, res) {
        res.json({
            message: "signup endpoint"
        })
    })
    
    userRouter.get("/purchases", function(req, res) {
        res.json({
            message: "signup endpoint"
        })
    })

module.exports = {
    userRouter : userRouter
}