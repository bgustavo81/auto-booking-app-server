express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// app.use("/api/chats", require("./routes/chats"));
app.use("/api/user", require("./routes/user"));
app.use("/api/booking", require("./routes/booking"))
app.use("/api/vehicle", require("./routes/vehicle"));
app.use("/api/upload", require("./routes/upload"));


const PORT = process.env.PORT || 5000;

let server = app.listen(PORT);