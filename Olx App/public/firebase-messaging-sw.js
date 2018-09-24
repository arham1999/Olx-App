importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
importScripts('https://www.gstatic.com/firebasejs/5.2.0/firebase.js');
// Initialize Firebase
var config = {
    apiKey: "AIzaSyBhLj3U_a-CPo-PVtmvcu_Gi3pcodO19As",
    authDomain: "olx-app-6120d.firebaseapp.com",
    databaseURL: "https://olx-app-6120d.firebaseio.com",
    projectId: "olx-app-6120d",
    storageBucket: "olx-app-6120d.appspot.com",
    messagingSenderId: "933481832738"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();



self.addEventListener('push', function (event) {
    var notification = event.data.json().notification;

    var title = notification.title;
    var body = notification.body;
    var icon = notification.icon;
 
    event.waitUntil(
      self.registration.showNotification(title, {
        body: body,
        icon: icon,
        tag: notification.tag
      })
    );
  
  });

  





  self.addEventListener('notificationclick', function (event) {
  
    console.log('On notification click: ', event);
    // Android doesn’t close the notification when you click on it
    // See: http://crbug.com/463146
    event.notification.close();
  
    firebase.database().ref(`notifications`).set({})
    // This looks to see if the current is already open and
    // focuses if it is
    event.waitUntil(
      clients.matchAll({  
        type: "window"  
      })
      .then(function(clientList) {  
        for (var i = 0; i < clientList.length; i++) {  
          var client = clientList[i];  
          if (client.url == '/' && 'focus' in client)  
            return client.focus();  
        }  
        if (clients.openWindow) {
          return clients.openWindow('/');  
        }
      })
    );
  
  });

