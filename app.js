/** @format */

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const server = require("http").createServer(app);
var indexRouter = require("./src/routes/index");
const { default: axios } = require("axios");

var app = express();
process.env.TZ = "UTC+1";
const corsOption = {
	
	origin: "*", //this will eventually be restricted on production
	// method: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
	// allowedHeader: ["Content-Type", "Authorization"],
	// exposedHeader: ["Authorization"],it
	// optionsSuccessStatus: 200,
	credentials: true,
};
console.log(corsOption)
app.use(cors(corsOption));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", indexRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    res.status(err.status || 500);
    res.send(err);
});

// Axios response interceptor
axios.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error) => {
        if (error.response && (error.response.data.code == 401 || error.response.status == 401)) {
            // Handle unauthorized error if needed
        }
        return error.response ? error.response.data : error;
    }
);

// Start the server
app.listen(5030, function () {
    console.log("running on port 5030");
});
