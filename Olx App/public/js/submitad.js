var db = firebase.database();

var fbstorage = firebase.storage();
var myId = localStorage.getItem('userId');

if(myId == 'null') {
    alert('Sign In First');
    location.href = 'signin.html';
}




function subAd() {
    document.querySelector('.loader').style.display = 'block';
    var form = document.querySelector('#formsubmit');
    var formData = new FormData(form);
    var adRef = db.ref('Ads').push();

    fbstorage.ref(`images/${adRef.key}`).put(document.querySelector('#file').files[0])
        .then(snapshot => {
            return snapshot.ref.getDownloadURL();
        })
        .then(downloadURL => {
            var adDetails = {
                adname: formData.get('name'),
                sellerId: myId,
                category: document.getElementById('category').options[document.getElementById('category').selectedIndex].value,
                description: formData.get('description'),
                price: formData.get('price'),
                model: formData.get('model'),
                name: formData.get('urname'),
                number: formData.get('number'),
                time: new Date().toLocaleString(),
                image: downloadURL
            }
            adRef.set(adDetails);
            db.ref(`notifications`).push().set({
                adname: formData.get('name'),
                category: document.getElementById('category').options[document.getElementById('category').selectedIndex].value,
                description: formData.get('description'),
                price: formData.get('price'),
                model: formData.get('model'),
                time: new Date().toLocaleString(),
                image: downloadURL
            });
            form.removeChild(document.getElementById('center'));
            alert('Ad Posted Successfully');
            form.reset();
        });
    return false

}