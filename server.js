const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const test = require("./routes/api/test");
// const passport = require("passport");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "PROD") {
  const whitelist = ["https://toihocweb.net/"];
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  };
  app.use(cors(corsOptions));
} else {
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );
}

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Passport middleware
// app.use(passport.initialize());

// Passport Config
// require("./config/passport")(passport);

// Use Routes
app.use("/api/v1/cheaterrank", test);
// app.use("/api/auth", user);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Server  on port ${port}`));
