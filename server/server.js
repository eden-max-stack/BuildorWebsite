const express = require("express");
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const path = require('path');
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 8087;


// increase json payload limit
app.use(bodyParser.json({ limit: "50mb" }));  // allow up to 50MB
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));


// custom middleware logger
app.use(logger);

// handle options credentals check before CORS
// and fetch cookies credentials requirement
app.use(credentials);

// cors
app.use(cors(corsOptions));

// middleware for json objects
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

// routes
const githubRoutes = require("./routes/api/githubAPI");
app.use('/api/github', githubRoutes);

app.use('/api/save-data', require('./routes/api/save-data'));

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server started on PORT ${PORT}...`);
});
