import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./db.js";

const app = express();
const port = process.env.SERVER_PORT || 8001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin : "http://localhost:5173",
  credentials : true
}))

app
  .route("/signup")

  .post((req, res) => {
    

    const username = req.body.username.toLowerCase(); //transformation
    const password = req.body.password;

    if (username.length < 5 || username.length > 15) {
      return res.status(400).json({
        success: false,
        message:
          "Username shouldn't be more than 15 characters and less than 5",
      });
    }

    if (/^[a-zA-Z0-9_]+$/.test(username) === false) {
      return res.status(400).json({
        success: false,
        message: "Username shouldn't Contain Special Characters And Spaces",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password should atleast be of 8 characters",
      });
    }

    async function DbCall() {
      try {
        const hashedpassword = await bcrypt.hash(password, 12);

        await pool.query(
          "INSERT INTO users (username,hash_password) VALUES ($1,$2)",
          [username, hashedpassword],
        );
        return res.status(200).json({
          success: true,
          message: "Signup Sucessfull",
        });
      } catch (error) {
        if (error.code === "23505") {
          return res.status(409).json({
            success: false,
            message: "Username alredy exists try different one",
          });
        }

        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    } // Dbcall funcc scope ends here

    DbCall();
  });

app
  .route("/login")

  .post((req, res) => {
    const username = req.body.username.toLowerCase();

    if (username.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    async function DbLookUp() {
      try {
        const userinfo = await pool.query(
          "SELECT * FROM users WHERE username = $1",
          [username],
        );

        if (userinfo.rowCount === 0) {
          return res.status(401).json({
            success: false,
            message: "Invalid Credentials Username or password didn't matched",
          });
        }

        const userid = userinfo.rows[0].userid;
        const dbusername = userinfo.rows[0].username;

        const plainPassword = req.body.password;

        if (!plainPassword || plainPassword === undefined) {
          return res.status(500).json({
            success: false,
            message: "Password Required",
          });
        }

        const hashPassword = userinfo.rows[0].hash_password;

        const passMathced = await bcrypt.compare(plainPassword, hashPassword);

        if (passMathced === false) {
          return res.status(401).json({
            success: false,
            message: "Invalid Credentials Username or password didn't matched",
          });
        }

        const token = jwt.sign(
          { username: dbusername, userid: userid },
          process.env.JWTKEY,
          { expiresIn: "2h" },
        );
        return res.cookie("jwt", token).status(200).json({
          success: true,
          message: "Logged In Sucessfull",
        });

        //NOTE :  Have to spend some time  studying about cookie security and Authorizaation Security from srinously
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    } // end of DbLookUp func Scpe

    DbLookUp();
  });

const jwtvalidation = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Session Expired Please login again",
    });
  }

  jwt.verify(token, process.env.JWTKEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: "Could not verify the token please login again",
      });
    }

    req.user = decoded;
    return next();
  });
};

app
  .route("/askname")

  .post(jwtvalidation, (req, res) => {
    const nickname = req.body.nickname;
    const userid = req.user.userid;

    if (!nickname) {
      return res.status(400).json({
        success: false,
        message: "Nickname is Required",
      });
    }

    if (/^[a-zA-Z ]+$/.test(nickname) === false) {
      return res.status(400).json({
        success: false,
        message: "Nickname Shouldn't contain special characters and Numbers",
      });
    }

    async function DbCall() {

      try {
        await pool.query(
          "UPDATE users SET nickname = $1 WHERE userid = $2;",
          [nickname, userid],
        );

        return res.status(200).json({
          success: false,
          message: `Welcome to the platform ${nickname}`,
        });

      } 
      
      catch (error) {

            res.status(500).json({
              success : false,
              message : "Server Error"
            })
            console.log(error);      

      }

    } // db call func scope ends here 

    DbCall();
  });

app.listen(port, () => {
  console.log("Server Started");
});
