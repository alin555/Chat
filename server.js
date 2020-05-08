const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
var findOrCreate = require('mongoose-findorcreate')

const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://alinz:201121480@cluster0-q31x3.mongodb.net/chatDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const userSchema = new mongoose.Schema({
    name: String,
    date: Date,
    room: String,
    lastActive: Date
});

const logSchema = new mongoose.Schema({
    user: [userSchema],
    text: String,
    date: Date,
    room: String
});

const roomSchema = new mongoose.Schema({
    name: String,
    password: String,
    main: Boolean
});

roomSchema.plugin(findOrCreate);


const User = new mongoose.model("User", userSchema);

const Log = new mongoose.model("Log", logSchema);

const Room = new mongoose.model("Room", roomSchema);


// const lobby = new Room({
//     name: "Lobby",
//     password: "",
//     main: true
// });
// lobby.save();
// const sex = new Room({
//     name: "Sex",
//     password: "",
//     main: true
// });
// sex.save();

// const gaming = new Room({
//     name: "Gaming",
//     password: "",
//     main: true
// });
// gaming.save();

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html")
});

app.get("/login", function (req, res) {
    const name = req.query.name;
    const date = new Date();
    const newUser = new User({
        name: name,
        date: date,
        room: "Lobby",
        lastActive: date
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
            date: date,
            room: foundUser.room
        });
        newLog.save();
    });
    res.send();
});

app.get("/getChatMsgs", function (req, res) {

    const date = new Date(req.query.date);
    const room = req.query.room;
    var results = {};

    Log.find({
        date: {
            $gt: date
        },
        room: room
    }, function (err, foundLog) {
        if (foundLog) {
            results.log = foundLog;
        }

        Room.find({main: false}, function (err, foundRoom) {
            results.room = foundRoom;
            res.send(results);
        });
    });
});

app.get("/onlineUsers", function (req, res) {
    const date = new Date();
    const id = req.query.userId;

    User.findOneAndUpdate({
        _id: id
    }, {
        lastActive: date
    },
    function (err, results) {
    });

    User.find({}, function (err, foundUser) {
        res.send(foundUser);
    });
});

app.get("/changeRoom", function (req, res) {
    room = req.query.room;
    userId = req.query.userId;
    password = req.query.password;

    Room.findOne({
        name: room
    }, function (err, foundRoom) {

        if (password == foundRoom.password) {

            User.findOneAndUpdate({
                    _id: userId
                }, {
                    room: room
                },
                function (err, results) {
                    res.send("1");
                });
        } else {
            res.send("0");
        }

    });

});

app.get("/createRoom", function (req, res) {
    const room = req.query.room;
    const password = req.query.password;

    Room.findOrCreate({
        name: room
    }, function (err, foundRoom, create) {
        if (create) {
            Room.findOneAndUpdate({
                name: room
            }, {
                $set: {
                    password: password,
                    main: false
                }
            }, {
                new: true
            }, function (err, doc) {
                res.send(doc.name)
            });
        } else if (foundRoom) {
            res.send("Lobby");
        }
    });
});

///////////////////////   Delete old users

setInterval(function () {
    const date = new Date();

    User.find({}, function (err, foundUser) {

        foundUser.forEach(function (user) {

            if ((date - user.lastActive) > 60000) {
                user.remove();
            }
        });

    });

    // Room.find({}, function(err, foundRoom) {
    //     User.find({})
    // });
}, 10000);

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("server started on port 3000");
});