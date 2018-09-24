var id = localStorage.getItem('userId');
var firebase_messaging = firebase.messaging();
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        console.log(user);
        document.getElementById('button-login').innerHTML = `<a href='Javascript:void(0)' aria-expanded="false" onclick="signout()"> 
        Sign Out </a>`;
        document.getElementById('ad').style.display = 'block';
        document.getElementById('sel').style.display = 'block';
        document.getElementById('buy').style.display = 'block';
        document.getElementById('fav').style.display = 'block';
        firebase.database().ref('users').on('child_added', e => {
            if(e.val().userid == id) {
                document.getElementById('write-name').innerText = `Welcome, ${e.val().name}`;
            }
        });

        firebase_messaging.requestPermission()
        .then(() => handleTokenRefresh())
        .catch(err => console.log('user didnt give permission', err))
        
        function handleTokenRefresh() {
            return firebase_messaging.getToken()
            .then(token => {
                console.log('token', token);
                firebase.database().ref(`tokens/${firebase.auth().currentUser.uid}`).set({
                    token: token,
                    userId: firebase.auth().currentUser.uid
                })
            });
        }

    }
    else {
        console.log('user logged out');
        document.getElementById('button-login').innerHTML = `<a href="signin.html" aria-expanded="false">
        Sign In</a>`
    }
})


function signout() {
    localStorage.setItem('userId', null);
    firebase.auth().signOut();
    location.reload();
}


// fetch('https://olx-app-6120d.firebaseio.com/Ads/-LI_fw-PF95OUOMkiFGP', {
//     mode: "no-cors", // no-cors, cors, *same-origin
// })
//   .then(response => {
//     console.log(response);
//   })