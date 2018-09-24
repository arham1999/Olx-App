var db = firebase.database();

var myId = localStorage.getItem('userId');
var sellerId;
var keyofad;

var myAds = [];
db.ref(`chats/buyers/${myId}`).on('child_added', ad => {
    myAds.push(ad.key);
})

db.ref(`Ads`).on('child_added', ads => {
    myAds.forEach(keys => {
        if (keys == ads.key) {
            document.getElementById('list').innerHTML += populateUser(ads.val(), ads.val().sellerId, ads.key);
        }
    });
})




function populateUser(data, sellkey, adkey) {
    return `<div class="row sideBar-body" onclick="initializeChat('${data.adname}', '${sellkey}', '${data.image}', '${adkey}')">
    <div class="col-sm-3 col-xs-3 sideBar-avatar">
              <div class="avatar-icon">
                <img src="images/usericon.png">
              </div>
    </div>
   <div class="col-sm-9 col-xs-9 sideBar-main">
       <div class="row">
           <div class="col-sm-8 col-xs-8 sideBar-name">
               <span class="name-meta">${data.name}
               </span>
           </div>
           <div class="col-sm-4 col-xs-4 pull-right sideBar-time">
               <span class="time-meta pull-right">${data.number}
               </span>
               </div>
               </div>
               </div>
               </div>`
}

function initializeChat(adname, sellerkey, adimage, adkey) {
    document.getElementById('adetail').classList.remove('message');
    document.getElementById('conversation').classList.remove('message');
    document.getElementById('conversation').classList.add('mess');
    document.getElementById('adetail').classList.add('mess');
    if (screen.width < 767) {
        document.querySelector('.side').style.display = 'none';
    }
    document.getElementById('avatarimg').src = adimage;
    document.getElementById('adName').innerText = adname;
    sellerId = sellerkey;
    keyofad = adkey;
    document.getElementById('adetail').innerHTML = showAdd(adname);



    var buyermsg = db.ref(`chats/buyers/${myId}/${adkey}`);
    document.getElementById('conversation').innerHTML = "";
    buyermsg.off('child_added');
    buyermsg.on('child_added', function (data) {
        if (data.val().from == undefined) {
            return false;
        }
        var userinfo = data.val();
        // console.log(data.val());
        if (userinfo.from == myId) {
            document.getElementById("conversation").innerHTML += `<div class="row message-body">
                    <div class="col-sm-12 message-main-sender">
                    <div class="sender">
                    <div class="message-text">
                    ${userinfo.message}
                    </div>
                    <span class="message-time pull-right">
                    ${userinfo.time}
                    </span>
                    </div>
                    </div>
                    </div>`
        }
        else {
            document.getElementById("conversation").innerHTML += `<div class="row message-body">
                    <div class="col-sm-12 message-main-receiver">
                        <div class="receiver">
                        <div class="message-text">
                        ${userinfo.message}
                            </div>
                            <span class="message-time pull-right">
                            ${userinfo.time}
                            </span>
                        </div>
                        </div>
                        </div>`
        }
    });


}

function sentmsg() {
    if (document.getElementById("comment").value == "") {
        alert("Write Some Thing");
        return false;
    }
    let msg = document.getElementById("comment").value;
    document.getElementById("comment").value = "";

    var usernam;
    db.ref(`users`).on('child_added', usr => {
        if (usr.val().userid == myId) {
            usernam = usr.val().name
        }
    })

    //for notification
    db.ref(`notifications`).push().set({
        message: msg,
        from: myId,
        username: usernam,
        adkey: keyofad,
        to: sellerId,
        time: (new Date()).toLocaleTimeString()
    })





    let chat = db.ref(`chats/buyers/${myId}/${keyofad}`).push();
    chat.set({
        message: msg,
        from: myId,
        time: (new Date()).toLocaleTimeString()

    });
    let chatFriend = db.ref(`chats/sellers/${sellerId}/${myId}/${keyofad}`).push();
    chatFriend.set({
        message: msg,
        from: myId,
        time: (new Date()).toLocaleTimeString()
    });
}



function showLeft() {
    document.querySelector('.side').style.display = 'block';
}


function showAdd(adnam) {
    return `<div class="row message-previous">
        <div class="col-sm-12 previous">
        <a name="20">${adnam}</a>
        </div>
    </div>`
}