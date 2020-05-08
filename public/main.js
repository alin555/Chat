const apiUrl = window.location.href;
var date = new Date().toJSON();
var chatLog = document.getElementById("chat-log");
var room = "Lobby";
var id = id;
var name = name;


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
    const password = $("#password").val();
    $.get(apiUrl + "createRoom?room=" + room + "&password=" + password, function (data) {
        changeRoom(room, password);
        $("#new-room-container").css("display", "none");
        $(".privateRooms").css("display", "inline-block");
        $("#private-room").append(newRoomContainer);
        $("#new-room-name").val("");
        $("#password").val("");
    });

});

$("#confirm").click(function () {
    const password = $("#password-check").val();
    $("#check-password-container").css("display", "none");
    $(".privateRooms").css("display", "inline-block");
    changeRoom(name, password);
});

setInterval(function () {
    const userId = localStorage.getItem("id");

    $.get(apiUrl + "onlineUsers?userId=" + userId, function (data) {

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

        data.log.forEach(function (msg) {
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
        if (data.log.length > 0) {

            date = data.log[data.log.length - 1].date;
        }

        data.room.forEach(function (room) {
            if ($("[name=" + room.name + "]").length == 0) {
                var newRoomContainer = document.createElement("div");
                var newRoomName = document.createElement("h2");
                newRoomContainer.classList.add("privateRoomContainer");
                newRoomContainer.addEventListener("click", enterPrivate);
                newRoomContainer.setAttribute("name", room.name);
                newRoomName.classList.add("privateRooms");
                newRoomName.innerHTML = room.name;
                newRoomContainer.appendChild(newRoomName);
                $("#private-room").append(newRoomContainer);
            }

        });

    });

}, 1000);

function changeRoom(newRoom, password = "") {
    room = newRoom;

    const userId = localStorage.getItem("id");
    $("#chat-log").html("");

    $("#roomName").html(room.charAt(0).toUpperCase() + room.slice(1));

    $.get(apiUrl + "changeRoom?room=" + newRoom + "&userId=" + userId + "&password=" + password, function (data) {
        if (data == "0") {

            changeRoom("Lobby");
        }
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

function enterPrivate() {
    // id = this.name;
    name = $(this).attr("name");

    $("#password-check").focus()

    $(".privateRooms").css("display", "none");
    $("#check-password-container").css("display", "flex");
};