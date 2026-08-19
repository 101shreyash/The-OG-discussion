import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import "dotenv/config"
import cors from "cors"
import cookieParser from "cookie-parser"


const app = express();
const port = process.env.SERVER_PORT || 8001


app.route("/")

.get((req,res) => {
    res.send("Server running smoothly")
})

app.listen(port , ()=> {console.log("Server Started")})




