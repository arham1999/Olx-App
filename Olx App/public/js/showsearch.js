
var _db = firebase.database();

var adValue = localStorage.getItem('adVal').charAt(0).toUpperCase() + localStorage.getItem('adVal').slice(1);
var adCategory = localStorage.getItem('adCat');

_db.ref('Ads').orderByChild('adname').equalTo(adValue).on('child_added', adData => {
    var adDet = adData.val();
    if (adCategory === 'All') {
        document.getElementById('search').innerHTML += `<li>
        <a href = "item.html" onclick="itemShow('${adData.key}')">
            <img src=${adDet.image} width="150px" height="120px" />
            <section class="left-side">
                <h5 class="item-heading">${adDet.adname}</h5>
                <span class="price-heading">Rs ${adDet.price}</span>
                <p class="cat-heading">${adDet.category}</p>
            </section>
            </a>
            <section id="catads" class="right-side">
                <span class="time-heading">${adDet.time}</span>
                <span><button class='offline-but' onclick= "offlinebut(this, '${adData.key}');">Add to Favourite</button></span>
            </section>
            <div class="clearfix"></div>
        </li>`
    }
    else {
        if(adCategory === adDet.category) {
            document.getElementById('search').innerHTML += `<li>
        <a href = "item.html" onclick="itemShow('${adData.key}')">
            <img src=${adDet.image} width="150px" height="120px" />
            <section class="left-side">
                <h5 class="item-heading">${adDet.adname}</h5>
                <span class="price-heading">Rs ${adDet.price}</span>
                <p class="cat-heading">${adDet.category}</p>
            </section>
            </a>
            <section class="right-side">
                <span class="time-heading">${adDet.time}</span>
                <span><button class='offline-but' onclick= "offlinebut(this, '${adData.key}');">Add to Favourite</button></span>
            </section>
            <div class="clearfix"></div>
        </li>`
        }
        
    }
})

