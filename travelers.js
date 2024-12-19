const express = require("express");
const app = express();
const port = 3003;

const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore ,Filter} = require("firebase-admin/firestore");
var serviceAccount = require("./serviceAccountKey.json");
const bodyparser = require("body-parser");
app.use(bodyparser.json());

app.use(bodyparser.urlencoded({extended:false}));
var passwordHash = require("password-hash");
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();
app.use(express.urlencoded({ extended: true })); 

// Load the JSON data from travelers.json
const travelersData = require('./travelers.json');

app.set('view engine', 'ejs');
app.use(express.static('public')); // This is for serving static files like images

app.get("/", (req, res) => {
  res.render('sign_log');
});

app.get("/signup", (req, res) => {
  res.render("signup");
});


app.post("/signinsubmit", (req, res) => {
  const Username = req.body.username;
  const Email = req.body.email;
  const Password = req.body.password;

  db.collection("ExploreEpic")
    .where("Email", "==", Email)
    .get()
    .then((emailDocs) => {
      if (!emailDocs.empty) {
        res.send("Hey, an account with this email address already exists.");
      } else {

        db.collection("ExploreEpic")
          .where(
            Filter.or(
              Filter.where("Email","==",Email),
              Filter.where("UserName", "==", Username)
            )
          )
          .get()
          .then((userDocs) => {
            if (!userDocs.empty) {
              res.send("Hey, an account with this Username and Email already exists.");
            } else {
              // Neither email nor username exists, so add the new account
              db.collection("ExploreEpic")
                .add({
                  UserName: Username,
                  Email: Email,
                  Password: passwordHash.generate(Password),
                })
                .then(() => {
                  console.log(Password);
                  res.render("signin_after", { UserName: Username });
                })
                .catch(() => {
                  res.send("Something went WRONG");
                });
            }
          });
      }
    });
});

app.get("/signin_after", (req, res) => {
  // const { UserName } = req.query.username;
  const UserName="hello";
  res.render('signin_after', { UserName });
});

app.get("/signin_aftersubmit",(req,res)=>{
  res.render('login');
});

app.get("/login", (req, res) => {
  res.render("login");
});


app.post("/loginsubmit", (req, res) => {
  const Email = req.body.email;
  const Password = req.body.password;

  db.collection("ExploreEpic")
    .where("Email", "==", Email)
    .get()
    .then((emailDocs) => {
      let verified = false;
      emailDocs.forEach((doc) => {
        verified = passwordHash.verify(Password, doc.data().Password); 
      });
      if (verified) {
        res.render("home"); 
      } else {
        res.render("login_after"); 
      }

    })
    .catch((error) => {
      console.error("Error logging in:", error);
      res.send("Something went wrong.");
    });
});


app.get("/login_after", (req, res) => {
  res.render('login_after');
});



app.get("/home", (req, res) => {
  res.render("home");
});
app.get("/explore", (req, res) => {
  res.render('explore');
});

app.get("/nearby", (req, res) => {
  res.render('nearby');
});

app.get("/transport", (req, res) => {
  res.render('transport');
});

app.get('/contact',(req,res)=>{
  res.render('contact');
})




app.get('/chikkamagaluru', (req, res) => {
  // Retrieve the data for Chikkamangaluru from travelersData
  const chikkamagaluruHotelsData = travelersData.chikkamagaluru;
  res.render('chikkamagaluru', { hotels: chikkamagaluruHotelsData });
});


app.get('/coimbatore', (req, res) => {
  // Retrieve the data for Coimbatore from travelersData
  const coimbatoreHotelsData = travelersData.coimbatore;
  res.render('coimbatore', { hotels: coimbatoreHotelsData });
});

app.get('/kanchi', (req, res) => {
  // Retrieve the data for kanchi from travelersData
  const kanchiHotelsData = travelersData.kanchi; 
  res.render('kanchi', { hotels : kanchiHotelsData});
});

app.get('/madhurai', (req, res) => {
    // Retrieve the data for Madurai from travelersData
    const madhuraiHotelsData = travelersData.madhurai;
    res.render('madhurai', { hotels: madhuraiHotelsData });
});

app.get('/madikeri', (req, res) => {
  // Retrieve the data for madikeri from travelersData
  const madikeriHotelsData = travelersData.madikeri; 
  res.render('madikeri', { hotels : madikeriHotelsData});
});

app.get('/mysore', (req, res) => {
  // Retrieve the data for mysore from travelersData
  const mysoreHotelsData = travelersData.mysore; 
  res.render('mysore', { hotels : mysoreHotelsData});
});

app.get('/padmanaba', (req, res) => {
  // Retrieve the data for padmanaba from travelersData
  const padmanabaHotelsData = travelersData.padmanaba; 
  res.render('padmanaba', { hotels : padmanabaHotelsData});
});

app.get('/sriharikota', (req, res) => {
  // Retrieve the data for sriharikota from travelersData
  const sriharikotaHotelsData = travelersData.sriharikota; 
  res.render('sriharikota', { hotels : sriharikotaHotelsData});
});

app.get('/tirupati', (req, res) => {
  // Retrieve the data for tirupati from travelersData
  const tirupatiHotelsData = travelersData.tirupati; 
  res.render('tirupati', { hotels : tirupatiHotelsData});
});

app.get('/tirupati_restaurant', (req, res) => {
 
  res.render('tirupati_restaurant');
});


app.get('/wayanad', (req, res) => {
  // Retrieve the data for Wayanad from travelersData
  const wayanadHotelsData = travelersData.wayanad;

  res.render('wayanad', { hotels : wayanadHotelsData });
});  


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




















