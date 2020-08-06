const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const test = require("./routes/api/test");
const user = require("./routes/api/user");
const passport = require("passport");
const fs = require("fs");
const app = express();
const https = require("https");
const path = require("path");
// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "PROD") {
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

// Server static assets if in production
// if (process.env.NODE_ENV === "PROD") {
//   // Set static folder
//   app.use(express.static("client/build"));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }

const options = {
  key: fs.readFileSync("./toihocweb_net.key"),
  cert: fs.readFileSync("./toihocweb_net.crt"),
};

const port = process.env.PORT || 8000;
const server = https
  .createServer(options, app)
  .listen(port, () => console.log(`Server running on port ${port}`));
const io = require("./socket").init(server);
var users = [];

io.on("connect", (socket) => {
  let currentUser = null;
  console.log("uusers: ", users);
  socket.on("user", (user) => {
    currentUser = user;
    const idx = users.findIndex((val) => val.id === user.id);
    if (idx === -1) {
      user.count = 1;
      users.push(user);
    } else {
      users[idx].count += 1;
    }
    console.log(users);
    io.emit("get online users", users);
  });
  socket.on("disconnect", (data) => {
    console.log("Client disconnected");
    console.log("user off", currentUser);
    if (currentUser) {
      const idx = users.findIndex((val) => val.id === currentUser.id);
      if (idx !== -1) {
        users[idx].count -= 1;
        if (users[idx].count === 0) {
          users.splice(idx, 1);
        }
      }
      io.emit("get online users", users);
    }
  });
});
