const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);


exports.sendNotifications = functions.database.ref(`notifications/{notificationId}`).onCreate(event => {
    console.log(event);
    const notificationSnap = event._data;
    if (notificationSnap.to == undefined) {
        const payload = {
            notification: {
                title: notificationSnap.adname,
                body: notificationSnap.description,
                icon: notificationSnap.image,
                click_action: 'https://olx-app-6120d.firebaseapp.com/'
            }
        }
        return admin.database().ref(`tokens`).once('value').then((data) => {

            if (!data.val()) return;

            const snapshot = data.val();
            const tokens = [];
            for (let key in snapshot) {
                tokens.push(snapshot[key].token);
            }
            console.log(tokens, payload);
            return admin.messaging().sendToDevice(tokens, payload);
        });
    }

    else {
        const payload = {
            notification: {
                title: `New message from ${notificationSnap.username}`,
                body: notificationSnap.message,
                icon: '../images/msgicon.png',
                click_action: 'https://olx-app-6120d.firebaseapp.com/'
            }
        }
        return admin.database().ref(`tokens/${notificationSnap.to}`).once('value').then((data) => {

            if (!data.val()) return;

            const snapshot = data.val();
            const tokens = snapshot.token;


            return admin.messaging().sendToDevice(tokens, payload);
        });

    }
})

