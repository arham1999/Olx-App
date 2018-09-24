var db = firebase.database();

var myId = localStorage.getItem('userId');
var buyerId;
var keyofad;


db.ref(`chats/sellers/${myId}`).on('child_added', buyer => {
    for (let key in buyer.val()) {
        populateUser(buyer.val()[key], buyer.key, key);
    }
})



async function populateUser(data, buyerkey, adkey) {
    var buyername = await new Promise( (resolve, reject) => {
        db.ref(`users`).on('child_added', buyer => {
            if (buyer.key == buyerkey) {
                resolve(buyer.val().name);
            }
        });
    });
    document.getElementById('list').innerHTML += `<div class="row sideBar-body" onclick="initializeChat('${data.adname}', '${data.image}', '${buyerkey}', '${adkey}')">
    <div class="col-sm-3 col-xs-3 sideBar-avatar">
              <div class="avatar-icon">
                <img src="images/usericon.png">
              </div>
    </div>
   <div class="col-sm-9 col-xs-9 sideBar-main">
       <div class="row">
           <div class="col-sm-8 col-xs-8 sideBar-name">
               <span class="name-meta">${buyername}
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

function initializeChat(adname, adimage, buyerkey, adkey) {
    document.getElementById('adetail').classList.remove('message');
    document.getElementById('conversation').classList.remove('message');
    document.getElementById('conversation').classList.add('mess');
    document.getElementById('adetail').classList.add('mess');
    if (screen.width < 767) {
        document.querySelector('.side').style.display = 'none';
    }
    document.getElementById('avatarimg').src = adimage;
    document.getElementById('adName').innerText = adname;
    buyerId = buyerkey;
    keyofad = adkey;
    document.getElementById('adetail').innerHTML = showAdd(adname);



    var sellermsg = db.ref(`chats/sellers/${myId}/${buyerkey}/${adkey}`);
    document.getElementById('conversation').innerHTML = "";
    sellermsg.off('child_added');
    sellermsg.on('child_added', data => {
        if (data.val().from == undefined) {
            return false;
        }
        var userinfo = data.val();
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
    db.ref(`notifications`).push().set({
        message: msg,
        from: myId,
        username: usernam,
        adkey: keyofad,
        to: buyerId,
        time: (new Date()).toLocaleTimeString()
    })





    let chat = db.ref(`chats/buyers/${buyerId}/${keyofad}`).push();
    chat.set({
        message: msg,
        from: myId,
        time: (new Date()).toLocaleTimeString()

    });
    let chatFriend = db.ref(`chats/sellers/${myId}/${buyerId}/${keyofad}`).push();
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