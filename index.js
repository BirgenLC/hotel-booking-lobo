const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bcrypt = require ("bycrypt")
const session = require("session")

const dbConnection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "the lobo village",
});
app.use(sessionManager){
  secret:"secret"
}
const app = express();

//middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
 
app.get("/login",(req,res)=>{
  const{email,password} =req.body});

  dbConnection.query(`SELECT * FROM users WHERE email =?`,[email],async (error,results)=>{
    if(err || results.length===0) return res.status(404).send("invalind credentials");
  const user = results[0]
  const validPass = await bycrpt.compare(password,user.password);
  if(!validPass) return res.status(401).send("incorrect password")
    req.session.user = {
  id:user.id,
  email:user.email,
  role:user.role,
};
})
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
