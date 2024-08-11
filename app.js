const express = require("express");
const cookieParser = require("cookie-parser");
const debug = require("debug");
const cors = require("cors");
const dotenv = require("dotenv");
const compression = require("compression");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const { ApiResponse, FLAG, STATUS_CODES, STATUS_MESSAGE } = require("./configuration/utils/ApiResponse.conf.js");

// NOTE: Set environment file.
const envFile = process.env.NODE_ENV || "development";
dotenv.config({ path: `./env/.env.${envFile}` });

// NOTE: Set default timezone on system level.
process.env.TZ = "UTC";

const app = express();

app.use(express.json({ limit: "16kb", extended: true }));
app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(cookieParser());

// Security and performance
app.use(helmet());
app.use(compression());

// Logging
app.use(morgan("combined"));

// Rate limiting to protect against DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: new ApiResponse(FLAG.FAIL, STATUS_CODES.LIMIT_EXHAUSTED, STATUS_MESSAGE.LIMIT_EXHAUSTED, []),
});
app.use(limiter);

// NOTE: Set cors to all.
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

// NOTE: Set routers for third party.
const indexRoute = require("./routers/index.js");
const authRoute = require("./routers/authentication/auth.js");
const userRoute = require("./routers/master/users.js");
const departmentRoute = require("./routers/master/departments.js");
const designationRoute = require("./routers/master/designations.js");

app.use("/", indexRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/departments", departmentRoute);
app.use("/api/v1/designations", designationRoute);

// NOTE: Default route handler.
app.use((req, res, next) => {
  res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.ROUTE_NOT_FOUND, STATUS_MESSAGE.ROUTE_NOT_FOUND, []));
});

// NOTE: Default error handler.
app.use((error, req, res, next) => {
  console.error(error.stack); // Log stack trace for debugging
  res.json(new ApiResponse(FLAG.FAIL, STATUS_CODES.SYSTEM_ERROR, error.message, []));
});

// NOTE: Server and port configuration.
app.set("port", process.env.PORT || 3000);
const server = app.listen(app.get("port"), function () {
  debug("Express server listening on port " + server.address().port);
});

module.exports = server;
