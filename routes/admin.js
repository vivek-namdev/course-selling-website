const { Router } = require("express");
const adminRouter = Router();
const { adminModel, courseModel } = require("../db");
const bcrypt = require("bcrypt");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const {JWT_ADMIN_PASSWORD} = require("../config");

const signupSchema = zod.object({
    email: zod.string().email({ message: "Invalid email address" }),
    password: zod.string().min(6, { message: "Password must be at least 6 characters long" }),
    firstName: zod.string().min(1, { message: "First name is required" }),
    lastName: zod.string().min(1, { message: "Last name is required" })
});

adminRouter.post("/signup", async function (req, res) {
    console.log("Request Body:", req.body);
    try {
        const validationResult = signupSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({
                message: "Validation failed",
                errors: validationResult.error.errors
            });
        }

        const validatedData = validationResult.data;

        const hashedPassword = await bcrypt.hash(validatedData.password, 10);

        await adminModel.create({
            email: validatedData.email,
            password: hashedPassword,
            firstName: validatedData.firstName, // Fixed typo here
            lastName: validatedData.lastName
        });

        res.json({
            message: "Signup succeeded"
        });
    } catch (error) {
        res.status(500).json({
            message: "Signup failed",
            error: error.message
        });
    }
});

adminRouter.post("/signin", async function (req, res) {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await adminModel.findOne({ email: email });

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
        const token = jwt.sign({ id: user._id }, JWT_ADMIN_PASSWORD); // Changed from 'admin' to 'user'

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

adminRouter.post("/course", adminModel, async function(req, res) {

    const adminId = req.userId;

    const {title, description, imageUrl, price} = req.body;

    const course = await courseModel.create({
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        creatorId: adminId
    })

    res.json({
        message: "course created",
        courseId: adminId
    })
})

adminRouter.put("/course", function(req, res) {
    res.json({
        message: "signup endpoint"
    })
})

adminRouter.get("/course/bulk", function(req, res) {
    res.json({
        message: "signup endpoint"
    })
})

module.exports = {
    adminRouter : adminRouter
}