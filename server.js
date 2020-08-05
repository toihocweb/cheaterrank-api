const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const test = require("./routes/api/test");
const user = require("./routes/api/user");
const passport = require("passport");

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "PROD") {
  // var whitelist = ["https://toihocweb.net", "http://toihocweb.net"];
  // var corsOptions = {
  //   origin: function (origin, callback) {
  //     console.log("origin", origin);
  //     if (whitelist.indexOf(origin) !== -1) {
  //       callback(null, true);
  //     } else {
  //       callback(new Error("Not allowed by CORS"));
  //     }
  //   },
  // };

  // app.use(cors(corsOptions));
  app.use(
    cors({
      origin: "https://toihocweb.net",
    })
  );
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
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/api/v1/cheaterrank", test);
app.use("/api/v1/cheaterrank/auth", user);

const port = process.env.PORT || 8000;
const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);
const io = require("./socket").init(server);
var users = [];

io.on("connect", (socket) => {
  var currentUser;
  socket.on("user", (user) => {
    if (users.indexOf(user) === -1) {
      users.push(user);
      currentUser = user;
    }
    io.emit("get online users", JSON.stringify(users));
  });
  socket.on("disconnect", (socket) => {
    console.log("Client disconnected");
    console.log("user off: ", currentUser);
    io.emit("get online users", JSON.stringify(users));
  });
});
