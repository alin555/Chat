const apiUrl = window.location.href;
var date = new Date().toJSON();
var chatLog = document.getElementById("chat-log");
var room = "Lobby";


$("#user-text").keypress(function (e) {
    if (e.which == 13) {
        send();
    }
});

$("#name").keypress(function (e) {
    if (e.which == 13) {
        login();
    }
});

$("#login-chat").click(login);

$("#send").click(send);

$("#new-room").click(function () {
    $(".privateRooms").css("display", "none");
    $("#new-room-container").css("display", "flex");
});

$("#create-room").click(function () {
    const room = $("#new-room-name").val();
    changeRoom(room);
    $("#new-room-container").css("display", "none");
    $(".privateRooms").css("display", "inline-block");
    var newRoomContainer = document.createElement("div");
    var newRoomName = document.createElement("h2");
    newRoomName.classList.add("privateRooms");
    newRoomName.innerHTML = room;
    newRoomContainer.appendChild(newRoomName);
    $("#private-room").append(newRoomContainer);
    $("#new-room-name").val("");
});

setInterval(function () {
    $.get(apiUrl + "onlineUsers", function (data) {

        var oldUsers = $(".currentUsers").toArray();

        data.forEach(function (user) {
            var exist = false;
            oldUsers.forEach(function (oldUser) {

                if (user._id == oldUser.id) {
                    exist = true;
                }
            });
            if (!exist) {
                var onlineUserDiv = document.createElement("div");
                onlineUserDiv.classList.add("currentUsers");
                onlineUserDiv.setAttribute("id", user._id);
                var onlineUser = document.createElement("h2");
                onlineUser.innerHTML = user.name;
                onlineUserDiv.appendChild(onlineUser);
                $("#online").append(onlineUserDiv);
            }

        });
        oldUsers.forEach(oldUser => {
            var exist = false;
            data.forEach(newUser => {
                if (oldUser.id == newUser._id) {
                    exist = true;
                }
            });
            if (!exist) {
                oldUser.remove();
            }
        });

    });
}, 5000);



setInterval(function () {

    $.get(apiUrl + "getChatMsgs?date=" + date + "&room=" + room, function (data) {


        data.forEach(function (msg) {
            const today = new Date();
            const h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();
            m = checkTime(m);
            s = checkTime(s);
            var newMsgContainer = document.createElement("div");
            newMsgContainer.classList.add("msg");
            var newMsg = document.createElement("p");
            var name = document.createElement("h2");
            var time = document.createElement("h3");
            name.innerHTML = msg.user[0].name + ":";
            newMsg.innerHTML = msg.text;
            time.innerHTML = h + ":" + m + ":" + s;
            newMsgContainer.appendChild(name);
            newMsgContainer.appendChild(newMsg);
            newMsgContainer.appendChild(time);
            $("#chat-log").append(newMsgContainer);
            chatLog.scrollTop = chatLog.scrollHeight - chatLog.clientHeight;
        });
        if (data.length > 0) {
            console.log(data[data.length - 1]);

            date = data[data.length - 1].date;
        }

    });

}, 1000);

function changeRoom(newRoom) {

    room = newRoom;

    const userId = localStorage.getItem("id");
    $("#chat-log").html("");

    $("#roomName").html(room.charAt(0).toUpperCase() + room.slice(1));

    $.get(apiUrl + "changeRoom?room=" + newRoom + "&userId=" + userId, function (data) {
        console.log(data);

    });
}


function checkTime(x) {
    if (x < 10) {
        x = "0" + x;
    }
    return x;
}

function send() {
    const userId = localStorage.getItem("id");
    const msg = $("#user-text").val();
    $.get(apiUrl + "sendMsg?userId=" + userId + "&msg=" + msg, function (data) {});
    $("#user-text").val("");
    $("#user-text").focus();

}

function login() {
    const name = $("#name").val();
    $.get(apiUrl + "login?name=" + name, function (data) {
        localStorage.setItem("id", data);
        $("#login-container").css("display", "none");
        $("#page").css("filter", "none");
    });
}

// function newRoom() {
//     const roomName = $("#new-room-name");
//     $.get(apiUrl + "newRoom?roomName=" + roomName, function (data) {
//         console.log(data);

//     });
// }