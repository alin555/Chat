const apiUrl = window.location.href;
var date = new Date().toJSON();
var chatLog = document.getElementById("chat-log");


$("#user-text").keypress(function(e){
    if (e.which == 13) {
        send();
    }
});

$("#name").keypress(function(e){
    if (e.which == 13) {
        login();
    }
});

$("#login-chat").click(login);

$("#send").click(send);

setInterval(function() {
    $("#online").html("");
    $.get(apiUrl+"onlineUsers", function(data) {
        data.forEach(function(user) {
            var onlineUserDiv = document.createElement("div");
            var onlineUser = document.createElement("h2");
            onlineUser.innerHTML = user.name;
            onlineUserDiv.appendChild(onlineUser);
            $("#online").append(onlineUserDiv);
        });

    });
}, 5000);



setInterval(function () {

    $.get(apiUrl + "getChatMsgs?date=" + date, function (data) {

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

        date = new Date().toJSON();
    });

}, 1000);


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