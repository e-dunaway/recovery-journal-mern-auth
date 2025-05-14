const dotenv = require("dotenv");
const express = require("express");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcryptjs = require("bcryptjs");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 8080;
const JWT_SECRET = process.env.JWT_SECRET || "_jwt_secret";

// modal connections
const Users = require("./loginModel");
const Journal = require("./model");

// connection to DB
mongoose
  .connect('mongodb://127.0.0.1:27017/DunJournal2024', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// configure dotenv
dotenv.config();

// Middleware
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Parse JSON bodies
app.use(cookieParser()); // Parse cookies from request headers

// Passport Local Strategy for login
passport.use(
  new LocalStrategy((username, password, done) => {
    // Looks up the user by username
    Users.findOne({ username: username })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: 'Incorrect username.' });
        }
        // If found, compares the submitted password with the hashed password in the database using bcrypt
        bcryptjs
          .compare(password, user.password)
          .then((res) => {
            console.log(res)
            if (res) {
              // If the password is correct, the authentication is successful.
              return done(null, user);
            } else {
              // Errors or authentication failures return appropriate messages and status
              return done(null, false, { message: 'Incorrect password.' });
            }
          })
          .catch(err => done(err));
      })
      .catch(err => done(err));
  })
);

// Passport JWT Strategy for handling token-based authentication
const opts = {
  jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]), // Extract JWT from cookies
  secretOrKey: JWT_SECRET, // Secret key for verifying the token
};

passport.use(
  new JwtStrategy(opts, (jwt_payload, done) => {
    Users.findById(jwt_payload.id) // Find user by ID encoded in the JWT
      .then((user) => {
        if (user) {
          return done(null, user); // User found
        } else {
          return done(null, false); // User not found
        }
      })
      .catch((err) => done(err, false));
  })
);

// Function to generate a JWT for a user
const generateToken = (user) => {

  return jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, {
    expiresIn: "1h", // Set expiration time for the token
  });
};

//test route
app.get("/", (req, res) => {
  res.send("I am connected")
})

// Routes
// Register a new user
app.post("/users", (req, res) => {

  let { username, password } = req.body;
  console.log("routehit")
  Users.create({ username, password })
    // Create new user document in MongoDB
    .then((user) => {
      res.status(201).json({ message: "User created", user }); // Send success response
    })
    .catch((err) => {
      res.status(400).json({
        message: "User already exists or other error", // Send error response
        error: err.message,
      });
    });
});

// Login a user and generate a JWT
app.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log(info);
    if (err) return next(err);
    if (!user)
      return res.status(401).json({ message: "Invalid username or password" });

    const token = generateToken(user); // Generate a JWT for the user
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    console.log("JWT Token:", token); // Debugging: Log the token
    return res.status(200).json({ message: "Login successful", user });
  })(req, res, next);
});

// Authenticate a user using JWT to access protected routes
app.get("/login",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // console.log("Cookies:", req.cookies);
    // console.log("JWT Cookie:", req.cookies.jwt);
    if (req.user) {
      // console.log("User logged in:", req.user);
      res.json({ message: "User is logged in", user: req.user });
    } else {
      // console.log("No user found in request");
      res.status(401).json({ message: "Unauthorized" });
    }
  }
);

// Check if the user is authenticated
app.get("/auth/check",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    if (req.user) {
      const userObj = {
        status: 200,
        user: req.user
      }
      res.json(userObj);
    } else {
      res.sendStatus(401);
    }
  }
);

// Logout a user and clear the JWT cookie
app.get("/logout", (req, res) => {
  res.clearCookie("jwt"); // Clear the JWT cookie
  res.json({ message: "Logout successful" });
});

// __________________________________________________________

app.post('/journal', (req, res) => {
  const { username, sobrietyDate, entryDate, feeling, cravingLevel, journalEntry } = req.body
  console.log(req.body)
  const newJournal = new Journal({
    username: username,
    sobrietyDate: sobrietyDate,
    entryDate: entryDate,
    feeling: feeling,
    cravingLevel: cravingLevel,
    journalEntry: journalEntry
  })
  newJournal
    .save()
    .then((data) => {
      console.log("Journal saved" + data)
      res.json(data)
    })
    .catch((err) => {
      console.log("Error saving journal: ", err)
      res.json({ error: 'An error occurred while saving journal' })
    })
});

app.get("/journal", (req, res) => {
  Journal.find((err, entry) => {
    if (err) console.error(err)
    res.send(entry)
  })
});

// app.get("/journal/:id", (req, res) => {
//   let journalID = req.params.id;
//   Journal.findOne({ _id: journalID }, (err, foundEntry) => {
//     if (err) {
//       console.error(err)
//     } else {
//       res.send(foundEntry)
//     }
//   })
// })

// app.get("/journal/:username", (req, res) => {
//   let username = req.params.username;
//   console.log(username)
//   Journal.find({ username: username}, (err, foundUser) => {
//     if (err) {
//       console.error(err)
//     } else {
//       res.send(foundUser)
//     }
//   })
// })

app.put("/journal/:id", (req, res) => {
  Journal.findByIdAndUpdate(
    req.params.id,
    {
      feeling: req.body.feeling,
      cravingLevel: req.body.cravingLevel,
      journalEntry: req.body.journalEntry
    },
    { new: true }
  )
    .then((data) => {
      console.log("Journal entry updated: " + data)
      res.json(data)
    })
    .catch((err) => {
      console.log("Error updating journal entry: " + err)
      res.status(500).send("Error updating journal entry")
    })
})

app.delete("/journal/:id", (req, res) => {
  Journal.findByIdAndDelete(req.params.id)
    .then((data) => {
      console.log("Journal entry deleted: " + data)
      res.send("Journal entry deleted")
    })
    .catch((err) => {
      console.log("Error deleting journal entry: " + err)
      res.status(500), json("Error deleting journal entry")
    })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});