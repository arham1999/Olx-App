var db = firebase.database();
var userId = localStorage.getItem('userId');

db.ref('Ads').on('child_added', ads => {
    var data = ads.val();
    switch (data.category) {
        case 'Properties':
            document.getElementById('data-properties').innerHTML += showData(data, ads.key);
            break;
        case 'Cars':
            document.getElementById('data-cars').innerHTML += showData(data, ads.key);
            break;
        case 'Bikes':
            document.getElementById('data-bikes').innerHTML += showData(data, ads.key);
            break;
        case 'Books, Sports & Hobbies':
            document.getElementById('data-books').innerHTML += showData(data, ads.key);
            break;
        case 'Electronics & Appliances':
            document.getElementById('data-electronics').innerHTML += showData(data, ads.key);
            break;
        case 'Fashion':
            document.getElementById('data-fashion').innerHTML += showData(data, ads.key);
            break;
        case 'Furniture':
            document.getElementById('data-furniture').innerHTML += showData(data, ads.key);
            break;
        case 'Jobs':
            document.getElementById('data-jobs').innerHTML += showData(data, ads.key);
            break;
        case 'Mobiles':
            document.getElementById('data-mobiles').innerHTML += showData(data, ads.key);
            break;
        case 'Pets':
            document.getElementById('data-pets').innerHTML += showData(data, ads.key);
    }

})



function showData(data, key) {
    return `<li>
    <a href = "item.html" onclick="itemShow('${key}')">
        <img src=${data.image} width="150px" height="120px" />
        <section class="left-side">
            <h5 class="item-heading">${data.adname}</h5>
            <span class="price-heading">Rs ${data.price}</span>
            <p class="cat-heading">${data.category}</p>
        </section>
        </a>
        <section id="catads" class="right-side">
            <span class="time-heading">${data.time}</span>
            <span><button class='offline-but' onclick= "offlinebut(this, '${key}');">Add to Favourite</button></span>
        </section>
        <div class="clearfix"></div>
    </li>`
}


function itemShow(key) {
    localStorage.setItem('adkey', key);
    window.location.href = 'item.html';

}


function offlinebut(element, offkey) {
    if(userId == 'null') {
        alert('Sign In First');
        return false;
    }
    if(element.innerText === 'Saved') {
        alert('already Saved');
        return false;
    }
    element.innerText = 'Saved';
    element.style.backgroundColor = '#3e8e41';
    element.style.boxShadow = '0 5px #666';
    element.style.transform = 'translateY(4px)';
    db.ref('Ads').on('child_added', snap => {
        if (snap.key === offkey) {
            if(userId == snap.val().sellerId) {
                element.innerText = 'Your Ad';
                element.style.backgroundColor = '#FF2323';
                alert('This is your Ad.');
                return false;
            }
           var offads = db.ref(`users/${userId}/SavedAds/${offkey}`);
           offads.set({falsevalue:'0'});
        }
    })
}


