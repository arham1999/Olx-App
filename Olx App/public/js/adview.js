var db = firebase.database();
var userId = localStorage.getItem('userId');

var mySavedAds = [];

db.ref(`users/${userId}/SavedAds`).on('child_added', ads => {
    mySavedAds.push(ads.key);
});

window.setTimeout(() => {
    fetch(`https://olx-app-6120d.firebaseio.com/Ads.json`)
    .then(response => response.json())
    .then(ad => {
        for(let i in ad) {
            mySavedAds.forEach(keys => {
                if (keys == i) {
                    document.getElementById('adview').innerHTML += view(ad[i], i);
                }
            });
        }
    })
}, 3000);



function view(data, key) {
    return `<li>
    <a href = "item.html" onclick="itemShow('${key}')">
        <img src=${data.image} width="150px" height="120px" />
        <section class="left-side">
            <h5 class="item-heading">${data.adname}</h5>
            <span class="price-heading">Rs ${data.price}</span>
            <p class="cat-heading">${data.category}</p>
        </section>
        </a>
        <section class="right-side">
            <span class="time-heading">${data.time}</span>
        </section>
        <div class="clearfix"></div>
    </li>`
}

function itemShow(key) {
    localStorage.setItem('adkey', key);
    window.location.href = 'item.html';
}