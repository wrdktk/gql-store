require("dotenv").config({ path: "variables.env" });
const cookieParser = require("cookie-parser");
const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

// TODO Use express middleware to handle cookies
server.express.use(cookieParser());

// TODO Use express middleware to populate current user

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
