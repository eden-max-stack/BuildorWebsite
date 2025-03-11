const express = require("express");
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const path = require('path');
const bodyParser = require("body-parser");
// require("./cron/Agenda"); // Import Agenda jobs


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

// save profile
app.use('/api/users', require('./routes/api/users'));

// get trending tech stack
app.use('/api/trends', require('./routes/api/trends'));

// run code
app.use('/api/coding/run', require('./routes/api/coding/runCode'));

// coding problems
app.use('/api/problems', require('./routes/api/problems'));

// fetch tech stack recommendation
app.use("/api/recommendations", require('./routes/api/recommendation'));

// error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`server started on PORT ${PORT}...`);
});
