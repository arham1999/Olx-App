var db = firebase.database();
var myId = localStorage.getItem('userId');

db.ref(`Ads`).on('child_added', child => {
    if (myId == child.val().sellerId) {
        document.getElementById('myads').innerHTML += showIt(child.val(), child.key)
    }
})



function showIt(data, key) {
    return `<li>
    <a href = "item.html" onclick="itemShow('${key}')">
        <img src=${data.image} width="150px" height="120px" />
        <section class="left-side">
            <h5 class="item-heading">${data.adname}</h5>
            <span class="price-heading">Rs ${data.price}</span>
            <p class="cat-heading">${data.category}</p>
        </section>
        </a>
        <section id="editdelbut" class="right-side">
            <span class="time-heading">${data.time}</span>
            <span><button class="offline-but" onclick="document.getElementById('id01').style.display='block';editIt('${key}')" style="width:auto;">Edit</button></span>
            <span><button style="background-color:#DE0E0E" class="offline-but" onclick= "deleteIt(this, '${key}');">X</button></span>
        </section>
        <div class="clearfix"></div>
    </li>`
}


async function deleteIt(element, key) {
    element.parentNode.parentNode.parentNode.style.display = 'none';
    db.ref(`Ads/${key}`).set({});
    firebase.storage().ref(`images/${key}`).delete();
    var array = [];
    var myBuyers = await new Promise(function (resolve, reject) {
        db.ref(`chats/sellers/${myId}`).once('value').then((buyer) => {
            for (let key in buyer.val()) {
                console.log(key)
                array.push(key);
            }
            resolve(array)
        })
    })
    myBuyers.forEach(buyersId => {
        db.ref(`chats/sellers/${myId}/${buyersId}/${key}`).set({});
        db.ref(`chats/buyers/${buyersId}/${key}`).set({});
    });
    db.ref(`users`).on('child_added', res => {
        db.ref(`users/${res.key}/SavedAds/${key}`).set({});
    })

}

function editIt(key) {
    localStorage.setItem('editAdKey', key);
    db.ref(`Ads`).on('child_added', ads => {
        if (key == ads.key) {
            var snapData = ads.val();
            document.getElementById('adname').value = snapData.adname;
            document.getElementById('category').value = snapData.category;
            document.getElementById('description').value = snapData.description;
            document.getElementById('price').value = snapData.price;
            document.getElementById('model').value = snapData.model;
            document.getElementById('urname').value = snapData.name;
            document.getElementById('number').value = snapData.number;
        }
    })

}

function updateIt() {
    document.querySelector('.loader').style.display = 'block';
    var edit_adkey = localStorage.getItem('editAdKey');
    var formDat = new FormData(document.querySelector('#mod'));
    var adref = db.ref(`Ads/${edit_adkey}`);
    firebase.storage().ref(`images/${edit_adkey}`).put(document.querySelector('#file').files[0])
        .then(snapshot => {
            return snapshot.ref.getDownloadURL();
        })
        .then(downloadURL => {
            var adDetails = {
                adname: formDat.get('adname'),
                sellerId: myId,
                category: document.getElementById('category').options[document.getElementById('category').selectedIndex].value,
                description: formDat.get('description'),
                price: formDat.get('price'),
                model: formDat.get('model'),
                name: formDat.get('urname'),
                number: formDat.get('number'),
                time: new Date().toLocaleString(),
                image: downloadURL
            }
            adref.update(adDetails);
            db.ref(`notifications`).push().set({
                adname: formDat.get('adname'),
                category: document.getElementById('category').options[document.getElementById('category').selectedIndex].value,
                description: formDat.get('description'),
                price: formDat.get('price'),
                model: formDat.get('model'),
                time: new Date().toLocaleString(),
                image: downloadURL
            });
            var array = [];
            var myBuyers = new Promise(function (resolve, reject) {
                db.ref(`chats/sellers/${myId}`).once('value').then((buyer) => {
                    for (let key in buyer.val()) {
                        console.log(key)
                        array.push(key);
                    }
                    resolve(array)
                })
            })
            myBuyers.then(arr => {

            arr.forEach(buyersId => {
                db.ref(`chats/sellers/${myId}/${buyersId}/${edit_adkey}`).update({
                    adname: formDat.get('adname'),
                    sellerId: myId,
                    category: document.getElementById('category').options[document.getElementById('category').selectedIndex].value,
                    description: formDat.get('description'),
                    price: formDat.get('price'),
                    model: formDat.get('model'),
                    name: formDat.get('urname'),
                    number: formDat.get('number'),
                    time: new Date().toLocaleString(),
                    image: downloadURL
                });
            })
            });
            document.querySelector('.containera').removeChild(document.getElementById('center'));
            alert('Ad Updated Successfully');
            document.querySelector('#mod').reset();
            location.reload();
        });
    return false
}