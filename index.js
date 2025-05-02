const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const session = require("express-session");

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "the lobo village",
});

const app = express();

//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "twisted",
    resave: false,
    saveUninitialized: true,
  })
);
//authorization middleware

const superAdminRoutes = ["/newSpot", "/newRoom", "/checkout"];
const receptionRoutes = ["/checkout", "/checkin", "/roomUpdates"];

//all other routes are public
app.use((req, res, next) => {
  if (req.session.user) {
    const userRole = req.session.user.role;
    if (userRole === "superadmin" && superAdminRoutes.includes(req.path)) {
      next();
    } else if (
      userRole === "reception" &&
      receptionisRoutes.includes(req.path)
    ) {
      next();
    } else if (userRole === "manager" && managerRoutes.includes(req.path)) {
      next();
    } else {
      if (
        superAdminRoutes.includes(req.path) ||
        receptionisRoutes.includes(req.path)
      ) {
        res.status(401).send("Unauthorized - 401");
      } else {
        next();
      }
    }
  }
});

//routes
app.get("/", (req, res) => {
  dbConnection.query("SELECT * FROM rooms", (roomSelectError, rooms) => {
    if (roomSelectError) {
      res.status(500).send("Server Error:500");
    } else {
      dbConnection.query("SELECT * FROM spots", (spotsSelectError, spots) => {
        if (spotsSelectError) {
          res.status(500).send("Send Error;500");
        } else {
          console.log(spots);
          res.render("index.ejs", { rooms, spots });
        }
      });
    }
  });
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/newSpot", (req, res) => {
  res.render("newSpot.ejs");
});

app.get("/newRoom", (req, res) => {
  res.render("newRoom.ejs");
});

app.get("/checkout", (req, res) => {
  res.render("checkout.ejs");
});

app.get("/addReceptionist", (req, res) => {
  res.render("addReceptionist.ejs");
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  dbConnection.query(
    `SELECT * FROM users WHERE email ="${email}"`,
    (error, userData) => {
      if (error) {
        res.status(500).send("Server Error:500");
      } else {
        if (userData.length == 0) {
          res.status(401).send("User not found");
          const user = userData[0];
          const isPasswordValid = bycrypt.compareSync(password, user.password);
          if (isPasswordValid) {
            res.send("Login successful");
          } else {
            //password is invalid
            res.status(401).send("Invalid password");
          }
        }
      }
    }
  );
});

console.log(bycrpt.hashSync("admin508", 2)); //hash password for testing

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
