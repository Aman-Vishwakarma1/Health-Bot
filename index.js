const express = require("express");
require("dotenv").config();
const cors = require("cors");
const session = require("express-session");
const mongoDbSessionStore = require("connect-mongodb-session")(session);
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

const store = new mongoDbSessionStore({
  uri: process.env.MONGODB_URI,
  collection: "session",
});

store.on("error", (e) => console.error(e));

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: store,
    resave: true,
    saveUninitialized: false,
  })
);
app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  console.log("Cookie Expires At:", req.session.cookie.maxAge);
  next();
});

app.use("/image", require("./routes/imageRoutes"));
app.use("/chat", require("./routes/aiChatRoutes"));

app.get("/", (req, res, next) => {
  res.status(200).json({ message: "Medical Bot API Running Fine !" });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
