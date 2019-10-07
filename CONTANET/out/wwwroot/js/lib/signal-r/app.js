var connection = new signalR.HubConnectionBuilder().withUrl("/hubs/akdemic").build();

connection.on("newNotification", function (text, state_text, date, readed, id, background_state_class, url) {
    Notifications.push({ text, state_text, date, readed, id, background_state_class, url });
    Notifications.load_slopes();
});

connection.start()
    .then(function () {
         
    });