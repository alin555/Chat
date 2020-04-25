const apiUrl = window.location.href;
var date = new Date().toJSON();

$("#user-text").keypress(function(e){
    if (e.which == 13) {
        send();
    }
});

$("#login-chat").click(function () {
    const name = $("#name").val();
    $.get(apiUrl + "login?name=" + name, function (data) {
        localStorage.setItem("id", data);
        $("#login-container").css("display", "none");
        $("#chat-container").css("filter", "none");
    });
});

// $("#send").click(function () {
//     const userId = localStorage.getItem("id");
//     const msg = $("#user-text").val();
//     $.get(apiUrl + "sendMsg?userId=" + userId + "&msg=" + msg, function (data) {});
// });

$("#send").click(send);

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
    
}