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

const superAdminRoutes = ["/newSpot", "/newRoom"];
const receptionistRoutes = ["/roomUpdates"];
const managerRoutes = ["/addReceptionist", "roomUpdates"];

//all other routes are public
app.use((req, res, next) => {
  if (req.session.user) {
    res.locals.user = req.session.user; //send user data to views/ejs
    //user is logged in
    const userRole = req.session.user.role;
    if (userRole === "superadmin" && superAdminRoutes.includes(req.path)) {
      next();
    } else if (
      userRole === "reception" &&
      receptionistRoutes.includes(req.path)
    ) {
      next();
    } else if (userRole === "manager" && managerRoutes.includes(req.path)) {
      next();
    } else {
      if (
        superAdminRoutes.includes(req.path) ||
        receptionistRoutes.includes(req.path)
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
// PUBLIC ROUTES
app.get("/", (req, res) => {});

app.get("/newRoom", (req, res) => {
  res.render("newRoom.ejs");
});
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/checkout", (req, res) => {
  res.render("checkout.ejs");
});

app.get("/checkin", (req, res) => {
  res.render("checkin.ejs");
});

app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.get("/book", (req, res) => {
  res.render("book.ejs");
});
app.get("/bookings", (req, res) => {
  res.render("bookings.ejs");
});

app.get("/newSpot", (req, res) => {
  res.render("newSpot.ejs");
});

app.get("/newRoom", (req, res) => {
  res.render("newRoom.ejs");
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
          const isPasswordValid = bcrypt.compareSync(password, user.password);
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

//console.log(bcrypt.hashSync("admin508", 2)); //hash password for testing

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
