const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://alinz:201121480@cluster0-q31x3.mongodb.net/chatDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userScheme = new mongoose.Schema({
    name: String,
    date: Date
});

const logScheme = new mongoose.Schema({
    user: [userScheme],
    text: String,
    date: Date
});

const User = new mongoose.model("User", userScheme);

const Log = new mongoose.model("Log", logScheme);

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

app.get("/login", function (req, res) {
    const name = req.query.name;
    const date = new Date();
    const newUser = new User({
        name: name,
        date: date
    });
    newUser.save(function (err, user) {
        res.send(user.id);
    });
});

app.get("/sendMsg", function (req, res) {
    const msg = req.query.msg;
    const userId = req.query.userId;
    const date = new Date();

    User.findOne({
        _id: userId
    }, function (err, foundUser) {
        const newLog = new Log({
            user: foundUser,
            text: msg,
            date: date
        });
        newLog.save();
    });
    res.send();
});

app.get("/getChatMsgs", function (req, res) {

    const date = new Date(req.query.date);

    Log.find({
        date: {
            $gte: date
        }
    }, function (err, foundLog) {
        if (foundLog) {
            res.send(foundLog);
        }
    });
});

app.get("/onlineUsers", function(req,res) {
    const date = new Date();
    User.find({}, function(err,foundUser) {
        res.send(foundUser);
    });
});

///////////////////////   Delete old logs

setInterval(function () {
    const date = new Date();

    User.find({}, function (err, foundUser) {
        
        foundUser.forEach(function (user) {
            
            if ((date - user.date) > 86400000) {
                user.remove();
            }
        });

    });
}, 10000);


app.listen("3000", function () {
    console.log("server started on port 3000");
});