const express = require("express");
const mongoose = require("mongoose");
const {userRouter} = require("./routes/user");
const {courseRouter} = require("./routes/course");
const {adminRouter} = require("./routes/admin");
const app = express();

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

async function main() {
    await mongoose.connect("mongodb+srv://viveknamdev018:ZckKKE9IkoDxkIP2@cluster0.r2qd2.mongodb.net/coursera-app")
    app.listen("3000");
    console.log("3000 port is running");   
}

main();