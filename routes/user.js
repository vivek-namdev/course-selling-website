const {Router} = require("express");
const {userModel} = require("../db");
const bcrypt = require("bcrypt");
const zod = require("zod");

const userRouter = Router();

const signupSchema = zod.object({
    email: zod.string().email({message: "Invalid email address"}),
    password: zod.string().min(6, {message: "Password must be atleast 6 characters long"}),
    firstName: zod.string().min(1, {message: "First name is required"}),
    lastName: zod.string().min(1, {message: "Last name is required"})
})

userRouter.post("/signup", async function(req, res) {
    console.log("Request Body:", req.body);
    try {
        const validationResult = signupSchema.safeParse(req.body);

        if(!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResult.error.errors
            })
        }

        const validatedData = validationResult.data;

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        await userModel.create({
            email: validatedData.email,
            password: hashedPassword,
            fisrtName: validatedData.firstName,
            lastName: validatedData.lastName
        })

        res.json({
            message: "Signup succeeded"
        })
    }
    catch (error) {
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