const {Router} = require("express");

const userRouter = Router();  

  userRouter.post("/user/signup", function(req, res) {
        res.json({
            message: "signup endpoint"
        })
    })
    
    userRouter.post("/user/signin", function(req, res) {
        res.json({
            message: "signup endpoint"
        })
    })
    
    userRouter.get("/user/purchases", function(req, res) {
        res.json({
            message: "signup endpoint"
        })
    })

module.exports = {
    userRouter : userRouter
}