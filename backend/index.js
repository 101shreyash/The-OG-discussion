import express, { json } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import pool from "./db.js";
import multer from "multer";

const app = express();
const port = process.env.SERVER_PORT || 8001;

// upload profile picture and community backgrounc picture in diff folder
const upload = multer({ dest: "profilepic" });
const communityBgImage = multer({ dest: "communitybgimg" });

// serving profilepic and community background picture
app.use("/profilepic", express.static("profilepic/"));
app.use("/communityBG", express.static("communitybgimg/"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

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
          "INSERT INTO users (username,hash_password,profile_picture) VALUES ($1,$2,$3)",
          [username, hashedpassword, "2700e7f0c8127299c83398ad578547c9"],
          // in case where user skips to add profile picture a default no profilepic image will be there
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
  .route("/checknickname")

  .get(jwtvalidation, (req, res) => {
    async function DbCall() {
      const userid = req.user.userid;
      try {
        const result = await pool.query(
          "SELECT nickname FROM  users WHERE userid = $1;",
          [userid],
        );

        const usernickname = result.rows[0].nickname;

        console.log(usernickname === null);

        if (usernickname === null) {
          return res.status(400).json({
            success: false,
            message: "Nickname is required",
          });
        }

        if (usernickname.length > 1 && usernickname !== null) {
          return res.status(200).json({
            success: true,
            message: "No need for nickname",
          });
        }
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbCall();
  });

app
  .route("/askname")

  .post(jwtvalidation, (req, res) => {
    const userid = req.user.userid;
    const nickname = req.body.nickname;

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
        await pool.query("UPDATE users SET nickname = $1 WHERE userid = $2;", [
          nickname,
          userid,
        ]);

        return res.status(200).json({
          success: true,
          message: `Welcome to the platform ${nickname}`,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Server Error",
        });
        console.log(error);
      }
    } // db call func scope ends here

    DbCall();
  });

app
  .route("/checkprofilepic")

  .get(jwtvalidation, (req, res) => {
    const userid = req.user.userid;

    // 2700e7f0c8127299c83398ad578547c9 this filename refers to image that says no profilepicture

    async function DbCall() {
      try {
        const result = await pool.query(
          "SELECT profile_picture FROM users WHERE userid = $1",
          [userid],
        );
        const ppurl = result.rows[0].profile_picture;

        if ((ppurl === "2700e7f0c8127299c83398ad578547c9") === true) {
          // is noprofile picture true  ?? then show the ui saying upload profilepic else dont show ui
          return res.status(200).json({
            success: true,
            message: "Display Add profilePicture UI",
          });
        }

        return res.status(200).json({
          success: true,
          message: "Don't show UI",
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbCall();
  });

app
  .route("/uploadprofile")

  .post(jwtvalidation, upload.single("profilepic"), (req, res) => {
    const ppurl = req.file?.filename;
    const userid = req.user.userid;

    async function DbCall() {
      try {
        await pool.query(
          "UPDATE users SET profile_picture = $1 WHERE userid = $2",
          [ppurl, userid],
        );
        return res.status(200).json({
          success: true,
          message: `Profile Picture Uploaded`,
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Server Error",
        });
        console.log(error);
      }
    }

    DbCall();
  });

app
  .route("/myprofile")

  .get(jwtvalidation, (req, res) => {
    const userid = req.user.userid;

    async function DbCall() {
      try {
        const result = await pool.query(
          "SELECT username , profile_picture , nickname , joined_date FROM users WHERE userid = $1;",
          [userid],
        );

        return res.status(200).json({
          success: true,
          message: result.rows[0],
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Server Error",
        });
        console.log(error);
      }
    }

    DbCall();
  });

app
  .route("/friendsprofile/:username")

  .get(jwtvalidation, (req, res) => {
    const username = req.params.username.toLowerCase();

    async function DbCall() {
      try {
        const result = await pool.query(
          "SELECT username , profile_picture , nickname FROM users WHERE username = $1",
          [username],
        );

        if (result.rowCount === 0) {
          return res.status(404).json({
            success: false,
            message: "Profile not found enter valid username",
          });
        }

        return res.status(200).json({
          success: true,
          message: result.rows[0],
        });
      } catch (error) {
        res.status(500).json({
          success: false,
          message: "Server Error",
        });
        console.log(error);
      }
    }

    DbCall();
  });

app
  .route("/logout")

  .delete((req, res) => {
    return res.status(200).clearCookie("jwt").json({
      success: true,
      message: "Logout sucessfull",
    });
  });

// ----------------------- Create Community -----------------------------

app
  .route("/createcommunity")

  .post(jwtvalidation, communityBgImage.single("commbg"), (req, res) => {
    const userid = req.user.userid;
    const communityName = req.body.communityname;
    const communityDescription = req.body.description?.toLowerCase();
    const communityType = req.body.type;
    const bgImageUrl = req.file?.filename;
    const plainPasskey = req.body.passkey;

    console.log("imageurl", bgImageUrl);

    if (!communityName) {
      return res.status(400).json({
        success: false,
        message: "Community Name is required!",
      });
    }

    if (!communityDescription) {
      return res.status(400).json({
        success: false,
        message: "Description is required!",
      });
    }

    if (!communityType) {
      return res.status(400).json({
        success: false,
        message: "Community Type is required!",
      });
    }

    if (/^[a-zA-Z ]+$/.test(communityName) === false) {
      return res.status(400).json({
        success: false,
        message:
          "Community Name cannot not include numbers and special characters",
      });
    }

    if (communityName.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Community name should be at least of 5 characters or more",
      });
    }

    if (communityDescription.length > 250) {
      return res.status(400).json({
        success: false,
        message: "Community Description too Long!",
      });
    }

    if (!plainPasskey) {
      return res.status(400).json({
        success: false,
        message: "Community Passkey is required!",
      });
    }

    if (plainPasskey.length < 5) {
      return res.status(400).json({
        success: false,
        message: "Passkey length should at least be of 5 characters or more",
      });
    }

    if (!bgImageUrl) {
      return res.status(400).json({
        success: false,
        message: "Backrgound Image is required!",
      });
    }

    async function DbCall() {
      const hashedPasskey = await bcrypt.hash(plainPasskey, 12);

      try {
        await pool.query(
          " INSERT INTO community (userid , community_name , community_passkey , community_description , community_bg_image , community_type) VALUES ($1,$2,$3,$4,$5,$6);",
          [
            userid,
            communityName,
            hashedPasskey,
            communityDescription,
            bgImageUrl,
            communityType,
          ],
        );

        return res.status(200).json({
          success: true,
          message: "Community Created Sucessfully",
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    } // db call scope end here

    DbCall();
  }); // create community route ends here

app
  .route("/viewyourcommunity")

  .get(jwtvalidation, (req, res) => {
    const userid = req.user.userid;

    async function DbCall() {
      try {
        const result = await pool.query(
          "SELECT community.community_name , community.community_id  FROM community INNER JOIN  members ON community.community_id = members.community_id WHERE members.userid = $1;",
          [userid],
        );        

        if (result.rowCount < 1) {
          return res.status(404).json({
            success: false,
            message: "No community Found Try Creating Some",
          });
        }

        return res.status(200).json({
          success: true,
          message: result.rows,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbCall();
  });

app
  .route("/explorecommunity/:communitytype")

  .get(jwtvalidation, (req, res) => {
    const communitytype = req.params.communitytype;

    async function DbCall() {
      try {
        const result = await pool.query(
          "SELECT community_id  , community_name , community_description , community_bg_image , created_date  FROM community WHERE community_type = $1;",
          [communitytype],
        );

        if (result.rowCount === 0) {
          return res.status(404).json({
            success: false,
            message: "No Community found with given type try Creating a One",
          });
        }

        return res.status(200).json({
          success: true,
          message: result.rows,
        });
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    } // Db Call Scope ends Here

    DbCall();
  });

app
  .route("/searchcommunity/:communityname")

  .get(jwtvalidation, (req, res) => {
    async function DbCall() {
      try {
        const communityname = req.params.communityname;

        const result = await pool.query(
          "SELECT community_id , community_name , community_description , community_bg_image  FROM community WHERE community_name ILIKE  $1",
          [communityname],
        );

        if (result.rowCount === 0) {
          return res.status(404).json({
            success: false,
            message:
              "No such community matched with given community name Input Valid CommunityName",
          });
        }

        return res.status(200).json({
          success: true,
          message: result.rows,
        });
      } catch (error) {
        console.log(error.message);
        return res.status(500).json({
          success: false,
          message: "Server Error",
        });
      }
    }

    DbCall();
  });

app
  .route("/joincommunity/:communityid")

  .post(jwtvalidation, (req, res) => {


    const userid = req.user.userid;
    const communityid = req.params.communityid;
    const communitypasskey = req.body.passkey

    if (!communityid) {

     return res.status(400).json({
        success : false,
        message : "Community Id is required"
      })
      
    }

    if (!communitypasskey) {

     return res.status(400).json({
        success : false,
        message : "Community Passkey is required"
      })
      
      
    }

    async function DbCall() {
      const result = await pool.query(
        "SELECT community_passkey FROM community WHERE community_id = $1 ",
        [communityid],
      );

      if (result.rowCount === 0) {
        return res.status(404).json({
          success: false,
          message:
            "No such community Found",
        });

      }

    const hashedCommunityPasskey = result.rows[0].community_passkey
    
         const macthed = await bcrypt.compare(communitypasskey , hashedCommunityPasskey)
         
         if (!macthed) {

        return  res.status(401).json({
             success : false,
            message : "Community Passkey Didin't matched"
          })
          
         }

         try {


      await pool.query("INSERT INTO members (userid , communitY_id) VALUES ($1,$2);" , [userid , communityid])
      return res.json({
      success : true,
      message : "Community Joined Sucessfully"
    })
          
        } 
         
         
         catch (error) {

          if (error.code === "23505") {

           return res.status(200).json({
              success : true,
              message : "You've Alredy Joined The community"
            })
            
          }

        console.log(error);
        return res.status(500).json({

          success : false,
            message : "Server Error"
          })
          

         }

        
      
    }

    DbCall();
  });

app.listen(port, () => {
  console.log("Server Started");
});
