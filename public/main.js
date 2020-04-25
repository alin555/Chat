const apiUrl = window.location.href;
var date = new Date().toJSON();

$("#login-chat").click(function () {
    const name = $("#name").val();
    $.get(apiUrl + "login?name=" + name, function (data) {
        localStorage.setItem("id", data);
        $("#login-container").css("display", "none");
        $("#chat-container").css("filter", "none");
    });
});

$("#send").click(function () {
    const userId = localStorage.getItem("id");
    const msg = $("#user-text").val();
    $.get(apiUrl +"sendMsg?userId=" + userId + "&msg=" + msg, function (data) {
    });
});

setInterval(function() {

    $.get(apiUrl + "getChatMsgs?date=" + date, function(data) {

        data.forEach(function(msg) {
            var newMsgContainer = document.createElement("div");
            var newMsg = document.createElement("p");
            var name = document.createElement("h2");
            name.innerHTML = msg.user[0].name + ":";
            newMsg.innerHTML = msg.text;
            newMsgContainer.appendChild(name);
            newMsgContainer.appendChild(newMsg);
            $("#chat-log").append(newMsgContainer);
        });



        date = new Date().toJSON();
    });
    
}, 1000);