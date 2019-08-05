require("dotenv").config({ path: "variables.env" });
const cookieParser = require("cookie-parser");
const createServer = require("./createServer");
const jwt = require("jsonwebtoken");
const db = require("./db");

const server = createServer();

server.express.use(cookieParser());

// decode JWT so we can grab user id for each request
server.express.use((req, res, next) => {
  const { token } = req.cookies;
  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    // put the userId on req for further requests to access
    req.userId = userId;
  }
  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is now running on http://localhost:${deets.port}`);
  }
);
