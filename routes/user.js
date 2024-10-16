const {Router} = require("express");
const {userModel, purchaseModel, courseModel} = require("../db");
const bcrypt = require("bcrypt");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const {JWT_USER_PASSWORD} = require("../config");
const { userMiddleware } = require("../middleware/user");

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
    
userRouter.post("/signin", async function(req, res) {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await userModel.findOne({ email: email });

        // Check if user exists
        if (!user) {
            return res.status(403).json({
                message: "Incorrect Credentials"
            });
        }

        // Compare provided password with the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(403).json({
                message: "Incorrect Credentials"
            });
        }

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, JWT_USER_PASSWORD);

        res.json({
            message: "Signin successful",
            token: token
        });

    } catch (error) {
        res.status(500).json({
            message: "Signin failed",
            error: error.message
        });
    }
});
    
userRouter.get("/purchases", userMiddleware, async function(req, res) {

    const userId = req.userId;

    const purchases = await purchaseModel.findOne({
        userId,
    });

    const courseData = await courseModel.find({
        _id : { $in: purchases.map(x => x.courseId) }
    })
    
            res.json({
           purchases,
           courseData
        })
    })

module.exports = {
    userRouter : userRouter
}