var db = firebase.database();
var userId = localStorage.getItem('userId');
var adkey = localStorage.getItem('adkey');



var ad = db.ref(`Ads`);
ad.on('child_added', user => {
    if (user.key == adkey) {
        document.getElementById('item').innerHTML = showItem(user.val());
        if(user.val().sellerId !== userId) {
            document.getElementById('chat-but').style.display = 'block';
        }
    }
})


function showItem(adToShow) {
    return `<h2>${adToShow.adname}</h2>
        <div class="item-image">
            <img src=${adToShow.image} />
        </div>
        <div class="product-details">
            <h4>
                <span class="info-details">Price </span> : Rs ${adToShow.price}
                <div class="clearfix"></div>
            </h4>
            <h4>
                <span class="info-details">Date </span> :
                            <strong>${adToShow.time}</strong>
            </h4>
            <h4>
                <span class="info-details">Model</span> : ${adToShow.model}</h4>
            <h4>
                <span class="info-details">User Name</span> : ${adToShow.name}</h4>
            <h4>
                <span class="info-details">Contact</span> : ${adToShow.number}</h4>
            <h4>
                <span class="info-details">Category</span> : ${adToShow.category}</h4>
            <h4>
                <span class="info-details">Details</span> :
                            <p>${adToShow.description}</p>
                <div class="clearfix"></div>
            </h4>
        </div>
    <div class="clearfix"></div>`

}



function chatShow() {
    if(userId == 'null') {
        alert('Sign In First');
        location.href = 'signin.html';
        return false;
    }
    ad.on('child_added', ads => {
        if (ads.key == adkey) {
            db.ref(`chats/buyers/${userId}/${adkey}`).set({falsevalue:'0'});
            db.ref(`chats/sellers/${ads.val().sellerId}/${userId}/${adkey}`).set(ads.val());
            location.href = 'mychat.html';
        }
    })
}


