var db = firebase.database();

function signUp() {
    var form1 = document.querySelector('#form1');
    var formData1 = new FormData(form1);
    firebase.auth().createUserWithEmailAndPassword(formData1.get('email'), formData1.get('password'))
        .then(res => {
            console.log('User created successfully!', res);
            var userRef = db.ref(`users/${res.user.uid}`);
            var user = {
                name: formData1.get('name'),
                userid: res.user.uid,
                email: formData1.get('email'),
                number: formData1.get('number')
            };
            userRef.set(user);
            window.location.href = 'signin.html';
        })
        .catch(error => {
            console.log(error);
        });

    form1.reset();
    return false
}

function logIn() {
    var form2 = document.querySelector('#form2');
    var formData2 = new FormData(form2);
    firebase.auth().signInWithEmailAndPassword(formData2.get('email'), formData2.get('password'))
        .then(res => {
            console.log('User Signed In Successfully!',res);
            localStorage.setItem('userId', res.user.uid);
            window.location.href = 'index.html';
        })
        .catch(error => {
            console.log(error);
        });
    form2.reset();
    return false
}

function googlesign() {
    firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .then(response =>{
        localStorage.setItem('userId', response.user.uid);
        var refer = db.ref(`users/${response.user.uid}`);
        var usr = {
            name: response.user.displayName,
            userid: response.user.uid,
            email: response.user.email,
            number: response.user.phoneNumber
        };
        refer.set(usr);  
        location.href = 'index.html'
    })
    .catch(error => console.log(error));
}