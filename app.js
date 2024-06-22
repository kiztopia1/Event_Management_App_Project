var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

const session = require("express-session");

var dashboardRouter = require("./routes/dashboard");
var adminRouter = require("./routes/admin");
var authRouter = require("./routes/auth");
var customersRouter = require("./routes/customer");
var employeeRouter = require("./routes/employee");
var app = express();

const eventsRouter = require("./routes/event");
const hallsRouter = require("./routes/hall");
const db = require("./db");

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const { isAuthenticated } = require("./middleware/auth");

// Apply isAuthenticated middleware globally

app.use("/", dashboardRouter);
app.use("/events", eventsRouter);
app.use("/halls", hallsRouter);
app.use("/customers", customersRouter);

app.use("/admins", adminRouter);
app.use("/auth", authRouter);
app.use("/employees", employeeRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
